@echo off
SET "PATH=%PATH%;C:\Program Files\nodejs"
echo Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo npm install failed
    exit /b %ERRORLEVEL%
)
echo Installation successful.
