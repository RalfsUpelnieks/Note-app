@echo off

cd backend
start cmd /k "dotnet run"

cd ../frontend
start cmd /k "npm start"