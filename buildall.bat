rem �ر��Զ����
@echo off 
set verno=
set /p verno=������汾��:
rem ����õ���������Ϣ
set tcrversion=%verno%

rem ���war
call mvn clean install

echo �����ӹ�war��
pause
cd ./target
md tcr_tmp
cd tcr_tmp
"%java_home%\bin\jar" -xf ../tcr_violin.war
cd ../..

echo ��Ӱ汾��Ϣ%tcrversion%��.\target\tcr_tmp\version
echo %tcrversion% > .\target\tcr_tmp\version.ini

echo ����js�ļ�
pause
call java -jar ./build/jscomp.jar ./target/tcr_tmp conf/*,scripts/*
echo ����js�ļ����

rem echo ���Ӷ���class
rem pause
rem xcopy .\build\com .\target\tcr_tmp\WEB-INF\classes\com /E /F /Y

rem echo ���ܻ���class�ļ�
rem call java -jar ./build/proguard.jar @./build/tcr.pro
rem xcopy .\target\newclasses\com .\target\tcr_tmp\web-inf\classes /e
rem pause

echo ���´��war
pause
cd ./target/tcr_tmp
"%java_home%\bin\jar" -cf ../selfmng.war ./*
cd ../..
echo %tcrversion%�ɹ������ target\selfmng.war
pause