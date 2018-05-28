rem 关闭自动输出
@echo off 
set verno=
set /p verno=请输入版本号:tcr_violin_build
rem 输出得到的输入信息
set tcrversion=tcr_violin_build%verno%
echo %tcrversion% > ./src/main/webapp/version

echo 加密js文件
call java -jar jscomp.jar src\main\webapp

call mvn clean install

rem 修改文件名
ren .\target\tcr_violin.war %tcrversion%.war

pause