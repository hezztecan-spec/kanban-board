@echo off
echo ========================================
echo   Запуск Kanban Board приложения
echo ========================================
echo.

echo Проверка занятых портов...
.\kill-ports.cmd

echo.
echo Запуск серверов...
echo.

echo [1/2] Запускаем Backend на порту 5000...
start "Kanban Backend Server" cmd /k "cd server && npm start"

echo.
timeout /t 3 /nobreak >nul

echo [2/2] Запускаем Frontend на порту 3000...
start "Kanban Frontend React" cmd /k "cd client && npm start"

echo.
echo ========================================
echo   Готово!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Network:  http://192.168.100.73:3000
echo.
echo Открылись 2 окна. Не закрывайте их!
echo.
pause

