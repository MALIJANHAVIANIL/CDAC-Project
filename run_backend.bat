@echo off
cd "c:\Users\Lenovo\Desktop\ElevateConnect"
echo Direct Launching Backend...
set MVN_BIN="C:\Users\Lenovo\.m2\wrapper\dists\apache-maven-3.9.12\59fe215c0ad6947fea90184bf7add084544567b927287592651fda3782e0e798\bin\mvn.cmd"
%MVN_BIN% spring-boot:run
pause
