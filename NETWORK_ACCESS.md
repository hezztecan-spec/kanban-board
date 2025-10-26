# Network Access Configuration

## Ваш IP адрес: 192.168.100.73

### Как другие пользователи могут заходить:

1. **Запустите приложение:**
```bash
npm run dev
```

2. **Другие пользователи заходят на:**
- **Frontend:** `http://192.168.100.73:3000`
- **API:** `http://192.168.100.73:5000`

3. **Настройка для внешних пользователей:**

Создайте файл `.env` в папке `client` со следующим содержимым:
```
REACT_APP_API_URL=http://192.168.100.73:5000
```

### Настройка Windows Firewall:

```cmd
# Разрешить порт 3000 (Frontend)
netsh advfirewall firewall add rule name="React App" dir=in action=allow protocol=TCP localport=3000

# Разрешить порт 5000 (Backend API)
netsh advfirewall firewall add rule name="Node API" dir=in action=allow protocol=TCP localport=5000
```

### Для команды:

1. **Каждый участник:**
   - Заходит на `http://192.168.100.73:3000`
   - Регистрируется: `/register`
   - Входит в систему: `/login`

2. **Создатель досок:**
   - Создает доски
   - Приглашает участников по email
   - Участники получают приглашения и могут работать вместе

3. **Все используют одну базу данных** (MongoDB Atlas)

### Если IP изменится:

1. Обновите CORS в `server/index.js`
2. Обновите `.env` файл в `client`
3. Перезапустите приложение

### Для внешнего доступа (интернет):

Используйте ngrok:
```bash
# Установите ngrok
npm install -g ngrok

# Запустите туннель
ngrok http 3000
```

Тогда другие смогут заходить по ссылке типа: `https://abc123.ngrok.io`
