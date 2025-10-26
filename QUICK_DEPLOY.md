# ⚡ Быстрый деплой (5 команд)

## 📦 Шаг 1: Загрузите на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШ_USERNAME/kanban-board.git
git push -u origin main
```

**Примечание:** Сначала создайте пустой репозиторий на https://github.com/new

---

## 🚀 Шаг 2: Railway (Backend)

1. Откройте https://railway.app
2. Login → Deploy from GitHub repo
3. Выберите ваш репозиторий
4. Settings → Root Directory → `server`
5. Variables → Добавьте:
   ```
   MONGODB_URI=ваша_строка_mongodb
   JWT_SECRET=любой_длинный_секретный_ключ
   ```
6. Скопируйте URL (например: `https://abc.railway.app`)

---

## ⚡ Шаг 3: Vercel (Frontend)

1. Откройте https://vercel.com
2. Import Project → GitHub → Выберите репозиторий
3. Настройки:
   - Root Directory: `client`
   - Framework: Create React App
4. Environment Variables:
   ```
   REACT_APP_API_URL=https://abc.railway.app/api
   ```
   (Вставьте ваш Railway URL!)
5. Deploy!

---

## ✅ Готово!

Ваше приложение доступно по ссылке от Vercel!

**Время:** ~15 минут  
**Стоимость:** Бесплатно 🎉

---

## 🔧 Нужна помощь?

Читайте подробную инструкцию: [DEPLOY_FREE.md](./DEPLOY_FREE.md)

