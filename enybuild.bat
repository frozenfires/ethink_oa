rem �ر��Զ����
@echo off 
set verno=
set /p verno=������汾��:tcr_violin_build
rem ����õ���������Ϣ
set tcrversion=tcr_violin_build%verno%
echo %tcrversion% > ./src/main/webapp/version

echo ����js�ļ�
call java -jar jscomp.jar src\main\webapp

call mvn clean install

rem �޸��ļ���
ren .\target\tcr_violin.war %tcrversion%.war

pause