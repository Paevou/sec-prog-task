@setlocal enableextensions
@cd /d "%~dp0"
cd ./api/database/
docker-compose up -d --force-recreate --build
cd ../../
timeout /t 5
call clientBuild.bat
cd ../api/
call npm install
call npm start