@echo off
chcp 65001 >nul
echo ========================================
echo   Деплой на бесплатный сервер
echo ========================================
echo.

echo Шаг 1: Настройка Git...
echo.
set /p NAME="Введите ваше имя (для Git): "
set /p EMAIL="Введите ваш email: "

git config --global user.name "%NAME%"
git config --global user.email "%EMAIL%"

echo.
echo [OK] Git настроен
echo.

echo Шаг 2: Инициализация репозитория...
git init
git add .
git commit -m "Initial commit - Kanban Board Application"

echo.
echo [OK] Код подготовлен
echo.

echo ========================================
echo   Создайте репозиторий на GitHub
echo ========================================
echo.
echo 1. Откройте: https://github.com/new
echo 2. Repository name: kanban-board
echo 3. Public или Private
echo 4. НЕ добавляйте README, .gitignore, license
echo 5. Нажмите "Create repository"
echo.
pause

echo.
set /p USERNAME="Введите ваш GitHub username: "

git branch -M main
git remote add origin https://github.com/%USERNAME%/kanban-board.git

echo.
echo Шаг 3: Загрузка на GitHub...
echo.
echo Сейчас откроется окно для ввода пароля GitHub
echo (Используйте Personal Access Token, если есть)
echo.
pause

git push -u origin main

echo.
echo ========================================
echo   Код загружен на GitHub!
echo ========================================
echo.
echo Репозиторий: https://github.com/%USERNAME%/kanban-board
echo.
echo ========================================
echo   Теперь деплой на серверы
echo ========================================
echo.
echo BACKEND (Railway):
echo 1. Откройте: https://railway.app
echo 2. Login через GitHub
echo 3. Deploy from GitHub repo → выберите kanban-board
echo 4. Settings → Root Directory → server
echo 5. Variables → добавьте MONGODB_URI и JWT_SECRET
echo 6. Скопируйте Public Domain URL
echo.
echo FRONTEND (Vercel):
echo 1. Откройте: https://vercel.com
echo 2. Import Project → GitHub → kanban-board
echo 3. Root Directory: client
echo 4. Environment Variables:
echo    REACT_APP_API_URL=ваш_railway_url/api
echo 5. Deploy!
echo.
echo Подробная инструкция: DEPLOY_FREE.md
echo.
pause

