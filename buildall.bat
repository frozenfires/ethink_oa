rem 关闭自动输出
@echo off 
set verno=
set /p verno=请输入版本号:
rem 输出得到的输入信息
set tcrversion=%verno%

rem 打包war
call mvn clean install

echo 后续加工war包
pause
cd ./target
md tcr_tmp
cd tcr_tmp
"%java_home%\bin\jar" -xf ../tcr_violin.war
cd ../..

echo 添加版本信息%tcrversion%到.\target\tcr_tmp\version
echo %tcrversion% > .\target\tcr_tmp\version.ini

echo 加密js文件
pause
call java -jar ./build/jscomp.jar ./target/tcr_tmp conf/*,scripts/*
echo 加密js文件完成

rem echo 附加定制class
rem pause
rem xcopy .\build\com .\target\tcr_tmp\WEB-INF\classes\com /E /F /Y

rem echo 加密混淆class文件
rem call java -jar ./build/proguard.jar @./build/tcr.pro
rem xcopy .\target\newclasses\com .\target\tcr_tmp\web-inf\classes /e
rem pause

echo 重新打包war
pause
cd ./target/tcr_tmp
"%java_home%\bin\jar" -cf ../selfmng.war ./*
cd ../..
echo %tcrversion%成功打包至 target\selfmng.war
pause