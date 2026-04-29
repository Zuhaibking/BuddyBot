@echo off
echo ==============================================
echo       Starting Buddy - The Kids Chatbot!      
echo ==============================================
echo.
echo Please ensure you've placed your API key in 
echo the .env file, otherwise Buddy won't 
echo be able to talk back!
echo.
echo Starting Web Browser...
start http://localhost:3000
echo.
echo Starting Server...
npm start
pause
