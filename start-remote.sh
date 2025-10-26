#!/bin/bash

echo "========================================"
echo "  Запуск приложения для удаленного доступа"
echo "========================================"
echo ""

echo "1. Проверяем ngrok..."
if ! command -v ngrok &> /dev/null; then
    echo "[!] ngrok не установлен!"
    echo ""
    echo "Установите ngrok:"
    echo "npm install -g ngrok"
    echo ""
    echo "Или скачайте с https://ngrok.com/download"
    exit 1
fi

echo "[OK] ngrok установлен"
echo ""

echo "2. Запускаем backend..."
cd server && npm start &
BACKEND_PID=$!
cd ..
sleep 3

echo "3. Запускаем ngrok для backend..."
ngrok http 5000 > /tmp/ngrok-backend.log &
NGROK_BACKEND_PID=$!
sleep 3

echo ""
echo "========================================"
echo "  ВАЖНО! Скопируйте URL от ngrok"
echo "========================================"
echo ""
echo "Получаем backend URL..."
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*ngrok[^"]*' | head -1)

if [ -z "$BACKEND_URL" ]; then
    echo "[!] Не удалось получить URL автоматически"
    echo "Откройте http://localhost:4040 в браузере"
    echo "И скопируйте URL вручную"
    read -p "Вставьте backend URL: " BACKEND_URL
fi

echo "Backend URL: $BACKEND_URL"
echo ""

echo "4. Создаем .env файл..."
echo "REACT_APP_API_URL=$BACKEND_URL/api" > client/.env
echo "[OK] .env создан"
echo ""

echo "5. Запускаем frontend..."
cd client && npm start &
FRONTEND_PID=$!
cd ..
sleep 5

echo ""
echo "6. Запускаем ngrok для frontend..."
ngrok http 3000 > /tmp/ngrok-frontend.log &
NGROK_FRONTEND_PID=$!
sleep 3

echo ""
FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*ngrok[^"]*' | tail -1)

echo "========================================"
echo "  Готово! "
echo "========================================"
echo ""
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo ""
echo "Отправьте Frontend URL людям для доступа!"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID $NGROK_BACKEND_PID $NGROK_FRONTEND_PID; exit" INT
wait

