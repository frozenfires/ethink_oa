
call mvn install:install-file -DgroupId=com.oracle -DartifactId=ojdbc14 -Dversion=10.2.0.1.0 -Dpackaging=jar -Dfile=exjars/ojdbc14-10.2.0.1.0.jar

call mvn install:install-file -DgroupId=log4jdbc -DartifactId=log4jdbc4 -Dversion=1.2 -Dpackaging=jar -Dfile=exjars/log4jdbc4-1.2.jar

call mvn install:install-file -DgroupId=org.directwebremoting -DartifactId=dwr -Dversion=3.0 -Dpackaging=jar -Dfile=exjars/dwr-3.0.jar

call mvn install:install-file -DgroupId=org.bouncycastle -DartifactId=bcpg-jdk15 -Dversion=143 -Dpackaging=jar -Dfile=exjars/bcpg-jdk15-143.jar

call mvn install:install-file -DgroupId=org.bouncycastle -DartifactId=bcprov-jdk15 -Dversion=143 -Dpackaging=jar -Dfile=exjars/bcprov-jdk15-143.jar

call mvn install:install-file -DgroupId=sybase -DartifactId=jconn -Dversion=4 -Dpackaging=jar -Dfile=exjars/jconn-4.jar

pause