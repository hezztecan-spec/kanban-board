@echo off
echo ========================================
echo   Запуск приложения для удаленного доступа
echo ========================================
echo.

echo 1. Проверяем ngrok...
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] ngrok не установлен!
    echo.
    echo Установите ngrok:
    echo npm install -g ngrok
    echo.
    echo Или скачайте с https://ngrok.com/download
    pause
    exit /b
)

echo [OK] ngrok установлен
echo.

echo 2. Запускаем backend...
start "Backend Server" cmd /k "cd server && npm start"
timeout /t 3 >nul

echo 3. Запускаем ngrok для backend...
start "Ngrok Backend" cmd /k "ngrok http 5000"
timeout /t 3 >nul

echo.
echo ========================================
echo   ВАЖНО! Скопируйте URL от ngrok
echo ========================================
echo.
echo В окне "Ngrok Backend" найдите строку:
echo   Forwarding  https://xxxxx.ngrok.io -^> http://localhost:5000
echo.
echo Скопируйте URL типа: https://xxxxx.ngrok.io
echo.
pause

echo.
set /p BACKEND_URL="Вставьте backend URL от ngrok (напр. https://abc123.ngrok.io): "

if "%BACKEND_URL%"=="" (
    echo [!] URL не указан!
    pause
    exit /b
)

echo.
echo 4. Создаем .env файл...
echo REACT_APP_API_URL=%BACKEND_URL%/api > client\.env
echo [OK] .env создан

echo.
echo 5. Запускаем frontend...
start "Frontend React" cmd /k "cd client && npm start"
timeout /t 5 >nul

echo.
echo 6. Запускаем ngrok для frontend...
start "Ngrok Frontend" cmd /k "ngrok http 3000"

echo.
echo ========================================
echo   Готово! 
echo ========================================
echo.
echo В окне "Ngrok Frontend" найдите URL типа:
echo   https://yyyyy.ngrok.io
echo.
echo Отправьте этот URL людям для доступа!
echo.
echo ВАЖНО: Не закрывайте эти окна пока работаете!
echo.
pause

