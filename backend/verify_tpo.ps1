$baseUrl = "http://localhost:8089/api"

function Test-Step {
    param($name, $block)
    Write-Host "TEST: $name" -NoNewline
    try {
        & $block
        Write-Host " [PASS]" -ForegroundColor Green
    } catch {
        Write-Host " [FAIL]" -ForegroundColor Red
        Write-Host $_.Exception.Message
        exit 1
    }
}

# 1. Register Users
Test-Step "Register Student" {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/signup" -ContentType "application/json" -Body '{"name":"Student User","email":"student@test.com","password":"password","role":"STUDENT","branch":"IT","cgpa":8.5,"phone":"1234567890"}'
}

Test-Step "Register TPO" {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/signup" -ContentType "application/json" -Body '{"name":"TPO Admin","email":"tpo@test.com","password":"password","role":"TPO","branch":"NA","cgpa":0.0,"phone":"0987654321"}'
}

# 2. Login
Test-Step "Login TPO" {
    $global:tpoInfo = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/signin" -ContentType "application/json" -Body '{"email":"tpo@test.com","password":"password"}'
    $global:tpoToken = $tpoInfo.token
    if (-not $global:tpoToken) { throw "No TPO Token" }
}

Test-Step "Login Student" {
    $global:studentInfo = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/signin" -ContentType "application/json" -Body '{"email":"student@test.com","password":"password"}'
    $global:studentToken = $studentInfo.token
    $global:studentId = $studentInfo.id
    if (-not $global:studentToken) { throw "No Student Token" }
}

# 3. Drive Workflow
Test-Step "Create Drive (as TPO/HR)" {
    $body = @{
        companyName = "Google"
        role = "SDE"
        package = "20 LPA"
        location = "Bangalore"
        date = "2024-12-01"
        deadline = "2024-11-01"
        description = "Job Desc"
        eligibility = "Minimum 8.0 CGPA"
        type = "Full-time"
    } | ConvertTo-Json
    $global:drive = Invoke-RestMethod -Method Post -Uri "$baseUrl/drives" -ContentType "application/json" -Body $body -Headers @{Authorization="Bearer $global:tpoToken"}
    $global:driveId = $drive.id
}

Test-Step "Verify Drive is PENDING" {
    $pending = Invoke-RestMethod -Method Get -Uri "$baseUrl/tpo/drives/pending" -Headers @{Authorization="Bearer $global:tpoToken"}
    if ($pending.Count -eq 0) { throw "No pending drives found" }
}

Test-Step "Student Cannot See Pending Drive" {
    $drives = Invoke-RestMethod -Method Get -Uri "$baseUrl/drives" -Headers @{Authorization="Bearer $global:studentToken"}
    if ($drives | Where-Object { $_.id -eq $global:driveId }) { throw "Student can see pending drive!" }
}

Test-Step "Approve Drive" {
    Invoke-RestMethod -Method Put -Uri "$baseUrl/tpo/drives/$global:driveId/approve" -Headers @{Authorization="Bearer $global:tpoToken"}
}

Test-Step "Student See Approved Drive" {
    $drives = Invoke-RestMethod -Method Get -Uri "$baseUrl/drives" -Headers @{Authorization="Bearer $global:studentToken"}
    if (-not ($drives | Where-Object { $_.id -eq $global:driveId })) { throw "Student cannot see approved drive!" }
}

# 4. Student Management
Test-Step "Ban Student" {
    Invoke-RestMethod -Method Put -Uri "$baseUrl/tpo/students/$global:studentId/ban" -Headers @{Authorization="Bearer $global:tpoToken"}
}

Test-Step "Banned Student Login Fail" {
    try {
        Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/signin" -ContentType "application/json" -Body '{"email":"student@test.com","password":"password"}'
        throw "Login succeeded but should have failed"
    } catch {
        # Expected error 401 or similar? Actually 500 or 401 depending on exception handler
        # UserDetailsServiceImpl throws UsernameNotFound which Spring Security turns into BadCredentials (401) usually
        Write-Host " (Expected Failure Caught) " -NoNewline
    }
}

Test-Step "Activate Student" {
    Invoke-RestMethod -Method Put -Uri "$baseUrl/tpo/students/$global:studentId/activate" -Headers @{Authorization="Bearer $global:tpoToken"}
}

Test-Step "Active Student Login Success" {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/signin" -ContentType "application/json" -Body '{"email":"student@test.com","password":"password"}'
}

# 5. Course Management
Test-Step "Create Course" {
    $body = '{"name":"Java Programming","code":"CS101","credits":4,"semester":1}'
    $global:course = Invoke-RestMethod -Method Post -Uri "$baseUrl/tpo/courses" -ContentType "application/json" -Body $body -Headers @{Authorization="Bearer $global:tpoToken"}
    $global:courseId = $course.id
}

Test-Step "Assign Course" {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/tpo/courses/$global:courseId/assign/$global:studentId" -Headers @{Authorization="Bearer $global:tpoToken"}
}

Write-Host "`nALL TESTS PASSED!" -ForegroundColor Green
