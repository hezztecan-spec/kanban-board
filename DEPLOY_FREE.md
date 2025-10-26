# 🚀 Деплой на бесплатный сервер (пошагово)

## 🎯 Вариант 1: Railway (САМЫЙ ПРОСТОЙ) - 10 минут

Railway предоставляет $5 бесплатных кредитов каждый месяц - этого хватит на небольшой проект!

### Шаг 1: Подготовка кода

1. **Создайте GitHub репозиторий:**
   - Зайдите на https://github.com/new
   - Назовите репозиторий (например, `kanban-board`)
   - Сделайте его публичным или приватным
   - НЕ добавляйте README или .gitignore (они уже есть)
   - Нажмите "Create repository"

2. **Загрузите код на GitHub:**
   ```bash
   # В папке вашего проекта
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_USERNAME/kanban-board.git
   git push -u origin main
   ```

### Шаг 2: Деплой Backend на Railway

1. **Зайдите на Railway:**
   - Откройте https://railway.app
   - Нажмите "Start a New Project"
   - Войдите через GitHub

2. **Создайте проект:**
   - Нажмите "Deploy from GitHub repo"
   - Выберите ваш репозиторий `kanban-board`
   - Нажмите "Deploy Now"

3. **Настройте backend:**
   - После деплоя откройте проект
   - Нажмите на сервис
   - Перейдите в "Settings" → "Root Directory"
   - Установите: `server`
   - Сохраните

4. **Добавьте переменные окружения:**
   - Перейдите в "Variables"
   - Добавьте переменные:
   ```
   MONGODB_URI=ваша_строка_подключения_mongodb_atlas
   JWT_SECRET=ваш_секретный_ключ_минимум_32_символа
   PORT=5000
   NODE_ENV=production
   ```

5. **Получите URL:**
   - Перейдите в "Settings"
   - Скопируйте "Public Domain" (например: `https://kanban-backend.up.railway.app`)

### Шаг 3: Деплой Frontend на Vercel (бесплатно навсегда!)

1. **Зайдите на Vercel:**
   - Откройте https://vercel.com
   - Нажмите "Start Deploying"
   - Войдите через GitHub

2. **Импортируйте проект:**
   - Нажмите "Add New..." → "Project"
   - Выберите ваш репозиторий `kanban-board`
   - Нажмите "Import"

3. **Настройте проект:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Добавьте переменную окружения:**
   - В разделе "Environment Variables" добавьте:
   ```
   REACT_APP_API_URL=https://kanban-backend.up.railway.app/api
   ```
   (Замените на ваш URL от Railway!)

5. **Деплой:**
   - Нажмите "Deploy"
   - Подождите 2-3 минуты
   - Получите URL (например: `https://kanban-board.vercel.app`)

### Шаг 4: Обновите CORS

В вашем проекте в файле `server/index.js` уже настроен автоматический CORS для Vercel и Railway! ✅

Но если нужно, можете добавить конкретный URL в массив `allowedOrigins`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app',  // Ваш Vercel URL
];
```

### Шаг 5: Готово! 🎉

Ваше приложение доступно по ссылке:
```
https://kanban-board.vercel.app
```

**Отправьте эту ссылку друзьям!**

---

## 🎯 Вариант 2: Render (Всё в одном месте)

Render предоставляет бесплатный tier с ограничениями (спящий режим после 15 минут неактивности).

### Backend на Render:

1. **Зайдите на Render:**
   - https://render.com
   - Войдите через GitHub

2. **Создайте Web Service:**
   - New → Web Service
   - Подключите GitHub репозиторий
   - Настройки:
     - **Name:** kanban-backend
     - **Root Directory:** `server`
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `node index.js`

3. **Добавьте переменные окружения:**
   - MONGODB_URI
   - JWT_SECRET
   - PORT=5000

4. **Создайте сервис** (это может занять 5-10 минут)

### Frontend на Render:

1. **Создайте Static Site:**
   - New → Static Site
   - Выберите тот же репозиторий
   - Настройки:
     - **Name:** kanban-frontend
     - **Root Directory:** `client`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `build`

2. **Добавьте переменную:**
   ```
   REACT_APP_API_URL=https://kanban-backend.onrender.com/api
   ```

3. **Создайте сервис**

---

## 🎯 Вариант 3: Netlify + Railway

### Backend: Railway (как в Варианте 1)

### Frontend: Netlify

1. **Зайдите на Netlify:**
   - https://netlify.com
   - Войдите через GitHub

2. **Импортируйте проект:**
   - Add new site → Import an existing project
   - Выберите GitHub репозиторий

3. **Настройки:**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`

4. **Переменные окружения:**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

5. **Deploy!**

---

## 📊 Сравнение сервисов

| Сервис | Бесплатный tier | Лучше для | Ограничения |
|--------|----------------|-----------|-------------|
| **Railway** | $5/месяц кредитов | Backend | Ограничено кредитами |
| **Vercel** | Безлимит | Frontend | Идеально для React |
| **Render** | 750 часов/месяц | Backend | Засыпает после 15 мин |
| **Netlify** | Безлимит | Frontend | Отлично для статики |

## 🏆 Моя рекомендация:

**Backend:** Railway (или Render)  
**Frontend:** Vercel (или Netlify)

Это сочетание даст вам:
- ✅ Быстрый деплой
- ✅ Автоматические обновления при push в GitHub
- ✅ SSL сертификаты (HTTPS)
- ✅ Бесплатно для небольших проектов

---

## 🔄 Автоматические обновления

После настройки, каждый раз когда вы делаете `git push`:
- Railway/Render автоматически обновит backend
- Vercel/Netlify автоматически обновит frontend

Это называется **Continuous Deployment (CD)**! 🚀

---

## 🆘 Проблемы?

### Backend не запускается:
1. Проверьте переменные окружения (MONGODB_URI особенно!)
2. Проверьте логи в Railway/Render
3. Убедитесь, что Root Directory = `server`

### Frontend не подключается к backend:
1. Проверьте REACT_APP_API_URL
2. Убедитесь, что URL backend правильный
3. Проверьте CORS настройки

### MongoDB не подключается:
1. MongoDB Atlas → Network Access
2. Добавьте `0.0.0.0/0` (доступ отовсюду)
3. Проверьте строку подключения

---

## 💡 Полезные ссылки

- Railway: https://railway.app
- Vercel: https://vercel.com
- Render: https://render.com
- Netlify: https://netlify.com
- MongoDB Atlas: https://cloud.mongodb.com

---

## 🎉 После деплоя

1. **Протестируйте:**
   - Зарегистрируйтесь
   - Создайте доску
   - Добавьте карточки
   - Пригласите друга

2. **Поделитесь:**
   - Отправьте ссылку друзьям
   - Работайте вместе!

3. **Мониторинг:**
   - Railway/Render показывают логи и использование ресурсов
   - Следите за бесплатными лимитами

---

## 📝 Быстрая шпаргалка

```bash
# 1. Создайте Git репозиторий
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/kanban-board.git
git push -u origin main

# 2. Railway Backend:
# - Deploy from GitHub
# - Root Directory: server
# - Добавить переменные: MONGODB_URI, JWT_SECRET

# 3. Vercel Frontend:
# - Import GitHub repo
# - Root Directory: client
# - Добавить: REACT_APP_API_URL

# 4. Готово!
```

---

Всё просто! Следуйте инструкции, и через 15 минут ваше приложение будет доступно всему миру! 🌍✨

