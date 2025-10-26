# 🔧 Решение проблем

## ❌ Ошибка: "address already in use" (Порт занят)

### Симптом:
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5000
```

### Решение:

**Автоматическое (Рекомендуется):**
```bash
.\kill-ports.cmd
```

**Или используйте полный скрипт запуска:**
```bash
.\start.cmd
```
Этот скрипт автоматически освободит порты и запустит приложение!

**Ручное:**
```bash
# Найти процесс на порту 5000
netstat -ano | findstr :5000

# Убить процесс (замените PID на номер из предыдущей команды)
taskkill /F /PID <PID>

# То же для порта 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

---

## ⚠️ Предупреждение: Duplicate schema index

### Симптом:
```
Warning: Duplicate schema index on {"token":1} found
```

### Решение:
✅ **УЖЕ ИСПРАВЛЕНО!** Обновите код:
```bash
git pull
# или просто перезапустите приложение
```

Файл `server/models/Invitation.js` был обновлен - убран дублирующийся индекс.

---

## 🔌 Ошибка подключения к MongoDB

### Симптом:
```
MongooseError: Could not connect to any servers
```

### Решение:

1. **Проверьте интернет соединение**
2. **Проверьте .env файл в папке server:**
   ```bash
   cd server
   type .env
   ```
   Должна быть строка `MONGODB_URI=...`

3. **Проверьте MongoDB Atlas:**
   - Зайдите на https://cloud.mongodb.com
   - Проверьте, что кластер запущен
   - Network Access → добавьте `0.0.0.0/0` (для доступа отовсюду)

---

## 🚫 Ошибка CORS

### Симптом:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

### Решение:
✅ **УЖЕ ИСПРАВЛЕНО!** Сервер автоматически принимает:
- localhost
- Ваш локальный IP
- ngrok URL
- Railway/Vercel URL

Если всё равно не работает:
1. Перезапустите сервер
2. Очистите кэш браузера (Ctrl + F5)
3. Проверьте консоль браузера для подробностей

---

## 📦 Ошибки с зависимостями

### Симптом:
```
Cannot find module 'xyz'
```

### Решение:
```bash
# Переустановите зависимости
npm run install-all

# Или по отдельности
cd server
npm install

cd ../client
npm install
```

---

## 🔄 Бесконечная загрузка / Белый экран

### Решение:

1. **Откройте консоль браузера** (F12)
2. **Посмотрите на ошибки**

**Если видите ошибки API:**
```bash
# Проверьте, что backend запущен
curl http://localhost:5000/api/health
```
Должен вернуть: `{"message":"Kanban Board API is running!"}`

**Если backend не отвечает:**
```bash
.\kill-ports.cmd
.\start.cmd
```

---

## 💾 Приложение не сохраняет данные

### Проверьте:

1. **MongoDB подключена:**
   ```bash
   # В консоли сервера должно быть:
   MongoDB connected successfully
   ```

2. **Токен авторизации:**
   - Откройте DevTools (F12) → Application → Local Storage
   - Должен быть ключ `token`

3. **Если токена нет - перелогиньтесь:**
   - Выйдите из системы
   - Войдите снова

---

## 🌐 Не могу зайти с другого устройства

### Проверьте:

1. **Оба устройства в одной WiFi сети**
2. **Windows Firewall:**
   ```bash
   netsh advfirewall firewall add rule name="React App" dir=in action=allow protocol=TCP localport=3000
   netsh advfirewall firewall add rule name="Node API" dir=in action=allow protocol=TCP localport=5000
   ```

3. **Используйте правильный IP:**
   ```bash
   ipconfig
   ```
   Найдите IPv4 адрес (например, `192.168.100.73`)

4. **Дайте полный URL:**
   ```
   http://192.168.100.73:3000
   ```
   (не `localhost`!)

---

## 🚀 Проблемы с ngrok

### Симптом: ngrok команда не найдена

**Решение:**
```bash
npm install -g ngrok
```

Или скачайте с https://ngrok.com/download

### Симптом: Приложение не загружается через ngrok URL

**Проверьте:**

1. **Файл .env в папке client:**
   ```bash
   cd client
   type .env
   ```
   Должно быть:
   ```
   REACT_APP_API_URL=https://your-backend.ngrok.io/api
   ```

2. **Оба ngrok туннеля запущены:**
   - Один для frontend (порт 3000)
   - Один для backend (порт 5000)

3. **Перезапустите frontend после изменения .env:**
   ```bash
   # Остановите (Ctrl+C)
   cd client
   npm start
   ```

---

## 🔍 Как проверить, что всё работает?

### 1. Backend:
```bash
curl http://localhost:5000/api/health
```
Ожидается: `{"message":"Kanban Board API is running!"}`

### 2. Frontend:
Откройте http://localhost:3000 в браузере

### 3. База данных:
В консоли сервера должно быть:
```
MongoDB connected successfully
Server running on 0.0.0.0:5000
```

### 4. Полный тест:
1. Зарегистрируйтесь
2. Создайте доску
3. Добавьте карточку
4. Перезагрузите страницу - данные должны сохраниться

---

## 📋 Быстрые команды

| Проблема | Команда |
|----------|---------|
| Порт занят | `.\kill-ports.cmd` |
| Запустить приложение | `.\start.cmd` |
| Удаленный доступ | `.\start-remote.cmd` |
| Переустановить зависимости | `npm run install-all` |
| Проверить backend | `curl http://localhost:5000/api/health` |
| Проверить порты | `netstat -ano \| findstr ":5000"` |

---

## 🆘 Ничего не помогает?

### Полная переустановка:

```bash
# 1. Остановите все процессы
.\kill-ports.cmd

# 2. Удалите node_modules
rmdir /s /q node_modules
rmdir /s /q server\node_modules
rmdir /s /q client\node_modules

# 3. Переустановите зависимости
npm run install-all

# 4. Запустите снова
.\start.cmd
```

### Проверьте версию Node.js:
```bash
node --version
```
Должна быть **v16 или выше**. Если нет - обновите с https://nodejs.org

---

## 💡 Полезные ссылки

- 📖 Основная документация: [README.md](./README.md)
- 🌍 Удаленный доступ: [REMOTE_ACCESS.md](./REMOTE_ACCESS.md)
- 🚀 Быстрый старт удаленно: [QUICK_START_REMOTE.md](./QUICK_START_REMOTE.md)
- 📝 Команды деплоя: [DEPLOY_COMMANDS.md](./DEPLOY_COMMANDS.md)

---

## 📞 Логи для отладки

Если нужна помощь, приложите:

1. **Версию Node:**
   ```bash
   node --version
   ```

2. **Ошибку из консоли сервера**

3. **Ошибку из консоли браузера (F12)**

4. **Вывод команды:**
   ```bash
   netstat -ano | findstr ":5000"
   netstat -ano | findstr ":3000"
   ```

