@echo off
echo ========================================
echo   Освобождение портов 3000 и 5000
echo ========================================
echo.

echo Поиск процессов на порту 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    set PID=%%a
    if not "%%a"=="0" (
        echo Найден процесс: %%a
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo [OK] Процесс %%a остановлен
        )
    )
)

echo.
echo Поиск процессов на порту 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    set PID=%%a
    if not "%%a"=="0" (
        echo Найден процесс: %%a
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo [OK] Процесс %%a остановлен
        )
    )
)

echo.
echo [OK] Порты освобождены
echo.

