# 🚀 Деплой БЕЗ Git (через веб-интерфейс)

## Если у вас нет Git установлен - это самый простой способ!

---

## 📦 Шаг 1: Загрузите код на GitHub

### Вариант А: Через веб-интерфейс (БЕЗ командной строки)

1. **Создайте архив проекта:**
   - Откройте папку `C:\Users\hezzt\Desktop\inter`
   - Выделите ВСЕ файлы и папки
   - Правый клик → Отправить → Сжатая ZIP-папка
   - Назовите: `kanban-board.zip`

2. **Зайдите на GitHub:**
   - https://github.com/new
   - Войдите в аккаунт (или создайте новый на https://github.com/signup)

3. **Создайте репозиторий:**
   - Repository name: `kanban-board`
   - Public или Private (на ваш выбор)
   - ❌ НЕ ставьте галочки на README, .gitignore, license
   - Нажмите "Create repository"

4. **Загрузите файлы:**
   - На странице репозитория нажмите "uploading an existing file"
   - Перетащите все файлы из папки `inter` (НЕ zip архив, а сами файлы!)
   - Или нажмите "choose your files" и выберите все
   - Внизу напишите: "Initial commit"
   - Нажмите "Commit changes"

### Вариант Б: Установите Git (если хотите использовать команды)

1. **Скачайте Git:**
   - https://git-scm.com/download/win
   - Скачайте и установите (везде нажимайте Next)

2. **После установки выполните команды:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/ВАШ_USERNAME/kanban-board.git
   git push -u origin main
   ```

---

## 🚀 Шаг 2: Деплой на Railway (Backend)

1. **Зайдите на Railway:**
   - Откройте https://railway.app
   - Нажмите "Start a New Project"
   - Войдите через GitHub (разрешите доступ)

2. **Создайте проект:**
   - Нажмите "Deploy from GitHub repo"
   - Выберите репозиторий `kanban-board`
   - Нажмите "Deploy Now"

3. **Настройте Root Directory:**
   - После деплоя откройте проект
   - Нажмите на название сервиса
   - Перейдите в "Settings"
   - Найдите "Root Directory"
   - Введите: `server`
   - Нажмите внизу "Update"
   - Сервис автоматически перезапустится

4. **Добавьте переменные окружения:**
   - Перейдите во вкладку "Variables"
   - Нажмите "New Variable"
   - Добавьте по одной:

   **Переменная 1:**
   ```
   Variable Name: MONGODB_URI
   Value: mongodb+srv://username:password@cluster.mongodb.net/kanban?retryWrites=true&w=majority
   ```
   (Замените на вашу строку из MongoDB Atlas!)

   **Переменная 2:**
   ```
   Variable Name: JWT_SECRET
   Value: supersecretkey12345678901234567890
   ```
   (Придумайте любой длинный секретный ключ!)

   **Переменная 3:**
   ```
   Variable Name: PORT
   Value: 5000
   ```

   **Переменная 4:**
   ```
   Variable Name: NODE_ENV
   Value: production
   ```

5. **Получите URL:**
   - Перейдите в "Settings"
   - Найдите "Public Networking"
   - Нажмите "Generate Domain"
   - Скопируйте URL (например: `https://kanban-backend-production.up.railway.app`)
   - **СОХРАНИТЕ ЭТОТ URL! Он понадобится!**

---

## ⚡ Шаг 3: Деплой на Vercel (Frontend)

1. **Зайдите на Vercel:**
   - Откройте https://vercel.com
   - Нажмите "Start Deploying" или "Sign Up"
   - Войдите через GitHub

2. **Импортируйте проект:**
   - На дашборде нажмите "Add New..." → "Project"
   - Выберите репозиторий `kanban-board`
   - Нажмите "Import"

3. **Настройте проект:**
   
   **Framework Preset:** Create React App (должно определиться автоматически)
   
   **Root Directory:** 
   - Нажмите "Edit" рядом с Root Directory
   - Выберите `client`
   
   **Build and Output Settings:**
   - Build Command: `npm run build` (должно быть по умолчанию)
   - Output Directory: `build` (должно быть по умолчанию)

4. **Добавьте переменную окружения:**
   - Раскройте секцию "Environment Variables"
   - Нажмите "Add"
   - Введите:
     ```
     Name: REACT_APP_API_URL
     Value: https://kanban-backend-production.up.railway.app/api
     ```
   - **ВАЖНО:** Замените URL на ваш URL от Railway (из Шага 2.5)!
   - Нажмите "Add"

5. **Деплой:**
   - Нажмите большую кнопку "Deploy"
   - Подождите 2-3 минуты
   - Вы увидите "Congratulations!" с конфетти 🎉

6. **Получите ссылку:**
   - После деплоя нажмите "Continue to Dashboard"
   - Вверху увидите URL: `https://kanban-board-abc123.vercel.app`
   - **ЭТО ВАША ССЫЛКА! Делитесь ей с друзьями!**

---

## ✅ Проверка

1. **Откройте ваш Vercel URL**
2. **Зарегистрируйтесь**
3. **Создайте доску**
4. **Добавьте карточку**

Если всё работает - ПОЗДРАВЛЯЮ! 🎉

Если нет - читайте раздел "Проблемы?" ниже.

---

## 🔄 Как обновить приложение?

### Через веб-интерфейс GitHub:

1. Зайдите на https://github.com/USERNAME/kanban-board
2. Найдите нужный файл
3. Нажмите на него
4. Нажмите кнопку "Edit" (карандаш)
5. Внесите изменения
6. Внизу "Commit changes"

Railway и Vercel автоматически обновятся! ✨

### Через загрузку файлов:

1. Зайдите в репозиторий
2. Нажмите "Add file" → "Upload files"
3. Перетащите обновленные файлы
4. Commit changes

---

## 🆘 Проблемы?

### Backend не запускается на Railway:

1. **Откройте логи:**
   - Railway → Ваш проект → Вкладка "Deployments"
   - Нажмите на последний деплой
   - Нажмите "View Logs"

2. **Частые проблемы:**
   - ❌ "MONGODB_URI is not defined" → Добавьте переменную MONGODB_URI
   - ❌ "Cannot find module" → Проверьте Root Directory = `server`
   - ❌ "Port already in use" → Удалите переменную PORT, Railway сам назначит

### Frontend не подключается к Backend:

1. **Проверьте переменную REACT_APP_API_URL:**
   - Vercel → Ваш проект → Settings → Environment Variables
   - Должна быть: `https://ваш-backend.railway.app/api` (с `/api` в конце!)

2. **Если изменили - передеплойте:**
   - Vercel → Deployments
   - Три точки → Redeploy

### Страница не загружается:

1. **Очистите кэш браузера:** Ctrl + Shift + R
2. **Откройте в режиме инкогнито**
3. **Проверьте консоль:** F12 → Console → посмотрите ошибки

---

## 📊 Статус серверов

Проверьте статус:
- Railway: https://railway.app/status
- Vercel: https://vercel-status.com
- MongoDB Atlas: https://status.cloud.mongodb.com

---

## 💰 Бесплатные лимиты

**Railway:**
- $5 кредитов в месяц
- Хватит на ~500 часов работы небольшого приложения
- Спальный режим при неактивности экономит кредиты

**Vercel:**
- Безлимитные деплои
- 100GB bandwidth в месяц
- Идеально для фронтенда!

**MongoDB Atlas:**
- 512MB хранилища
- Хватит для сотен досок и карточек

---

## 🎉 Готово!

Теперь у вас есть:
- ✅ Рабочее приложение в интернете
- ✅ Постоянная ссылка для друзей
- ✅ Автоматические обновления при изменении кода
- ✅ HTTPS (безопасное соединение)
- ✅ Бесплатный хостинг!

---

## 📝 Ваши ссылки (сохраните их!)

```
GitHub: https://github.com/USERNAME/kanban-board
Railway Backend: https://ваш-backend.railway.app
Vercel Frontend: https://ваш-frontend.vercel.app
```

**Делитесь Frontend ссылкой с друзьями!** 🚀

---

## 📚 Дополнительно

- 📖 Подробная инструкция: [DEPLOY_FREE.md](./DEPLOY_FREE.md)
- ⚡ Быстрая команды: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- 🔧 Решение проблем: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

