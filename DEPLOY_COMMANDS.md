# 📝 Команды для деплоя

## Вариант 1: Локальная сеть (WiFi)

### Без дополнительной настройки!

```bash
# Просто запустите
npm run dev
```

**Дайте людям ссылку:**
```
http://192.168.100.73:3000
```

✅ Работает сразу для всех в той же WiFi сети!

---

## Вариант 2: ngrok (Через интернет)

### Автоматический способ (Рекомендуется):

```bash
# Windows
start-remote.cmd

# Mac/Linux
bash start-remote.sh
```

### Ручной способ:

```bash
# Терминал 1 - Backend
cd server
npm start

# Терминал 2 - Backend ngrok
ngrok http 5000
# Скопируйте URL: https://abc123.ngrok.io

# Терминал 3 - Создайте .env
echo REACT_APP_API_URL=https://abc123.ngrok.io/api > client/.env

# Терминал 4 - Frontend
cd client
npm start

# Терминал 5 - Frontend ngrok
ngrok http 3000
# Скопируйте URL: https://xyz789.ngrok.io
```

**Дайте людям frontend URL:**
```
https://xyz789.ngrok.io
```

---

## Вариант 3: Railway (Постоянный хостинг)

### Через веб-интерфейс (Самый простой):

1. Зайдите на https://railway.app
2. Войдите через GitHub
3. New Project → Deploy from GitHub repo
4. Выберите этот репозиторий
5. Railway автоматически деплоит
6. Получите URL типа: `https://your-app.railway.app`

### Через CLI:

```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите
railway login

# Инициализируйте проект
railway init

# Деплой backend
cd server
railway up

# Деплой frontend
cd ../client
railway up

# Получите URL
railway status
```

---

## Вариант 4: Vercel (Frontend) + Railway (Backend)

### Frontend на Vercel:

```bash
# Установите Vercel CLI
npm install -g vercel

# Перейдите в папку клиента
cd client

# Деплой
vercel

# Следуйте инструкциям

# Получите URL типа: https://kanban-app.vercel.app
```

### Backend на Railway:

```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите
railway login

# Перейдите в папку сервера
cd server

# Инициализируйте и деплой
railway init
railway up

# Добавьте переменные окружения
railway variables set MONGODB_URI="ваша_строка_подключения"
railway variables set JWT_SECRET="ваш_секретный_ключ"

# Получите URL типа: https://kanban-api.railway.app
```

### Настройте связь:

В Vercel добавьте переменную окружения:
```
REACT_APP_API_URL=https://kanban-api.railway.app/api
```

Затем передеплойте:
```bash
vercel --prod
```

---

## Проверка деплоя

### Для локального/ngrok:

```bash
# Проверьте backend
curl http://localhost:5000/api/health

# Ожидается: {"message":"Kanban Board API is running!"}
```

### Для облачного:

```bash
# Проверьте backend
curl https://your-backend-url.com/api/health

# Проверьте frontend
curl https://your-frontend-url.com
```

---

## Переменные окружения

### Backend (.env в папке server):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=production
```

### Frontend (.env в папке client):

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Быстрая справка

| Задача | Команда |
|--------|---------|
| Локальный запуск | `npm run dev` |
| Запуск с ngrok | `start-remote.cmd` |
| Деплой на Railway | `railway up` |
| Деплой на Vercel | `vercel` |
| Проверка backend | `curl URL/api/health` |
| Установка зависимостей | `npm run install-all` |

---

## Troubleshooting

### Проблема: Приложение не запускается

```bash
# Переустановите зависимости
npm run install-all

# Проверьте версию Node
node --version  # Должна быть v16+

# Очистите кэш
npm cache clean --force
```

### Проблема: CORS ошибка

Сервер уже настроен! Но если нужно добавить дополнительный URL:

В `server/index.js` в массив `allowedOrigins` добавьте ваш URL.

### Проблема: База данных не подключается

Проверьте `MONGODB_URI` в `.env`:
```bash
# Backend папка
cat server/.env
# Должен быть MONGODB_URI
```

---

## Полезные ссылки

- 📖 Полная инструкция: [REMOTE_ACCESS.md](./REMOTE_ACCESS.md)
- 🚀 Быстрый старт: [QUICK_START_REMOTE.md](./QUICK_START_REMOTE.md)
- 🌐 Railway: https://railway.app
- ⚡ Vercel: https://vercel.com
- 🔧 ngrok: https://ngrok.com

