# Kanban Board Application

A beautiful, modern Kanban board application built with React and Node.js, featuring drag-and-drop functionality, real-time collaboration, and a stunning UI.

## 🎯 Быстрый старт

**Не знаете, с чего начать?** 👉 **[START_HERE.md](./START_HERE.md)**

**Хотите выложить на бесплатный сервер?** 👉 **[DEPLOY_NO_GIT.md](./DEPLOY_NO_GIT.md)**

## Features

### 🎯 Core Functionality
- **Create Boards**: Organize projects with customizable boards
- **Columns Management**: Add, edit, and delete columns (To Do, In Progress, Done)
- **Card System**: Create, edit, and move cards between columns
- **Drag & Drop**: Smooth drag-and-drop functionality for cards
- **User Collaboration**: Invite team members to boards
- **Role Management**: Admin and member roles with different permissions

### 🎨 Beautiful Design
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Color Customization**: Choose from 12 beautiful color themes
- **Smooth Animations**: Framer Motion animations throughout the app
- **Gradient Backgrounds**: Beautiful gradient backgrounds and cards

### 🔐 User Management
- **Authentication**: Secure login and registration
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **User Profiles**: User management with avatars
- **Invitation System**: Email-based invitation system
- **Permission Control**: Role-based access control

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **React Beautiful DnD**: Drag and drop functionality
- **React Hot Toast**: Beautiful notifications
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database (MongoDB Atlas)
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation
- **CORS**: Cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd kanban-board
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **MongoDB Setup**
The application is already configured to use MongoDB Atlas cloud database. No local MongoDB installation required!

4. **Run the application**

**Простой способ (Рекомендуется):**
```bash
.\start.cmd
```
Этот скрипт автоматически освободит порты и запустит приложение!

**Или классический способ:**
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### 🔧 Если порты заняты:
```bash
.\kill-ports.cmd
```

## 🌍 Доступ для удаленных пользователей

### 🚀 Выложить на БЕСПЛАТНЫЙ сервер (Рекомендуется!)

**Хотите постоянную ссылку для друзей? Выложите на бесплатный хостинг!**

📖 **БЕЗ Git (через веб):** [DEPLOY_NO_GIT.md](./DEPLOY_NO_GIT.md) - **НАЧНИТЕ ЗДЕСЬ!**  
⚡ **С Git (быстро):** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)  
📚 **Подробная инструкция:** [DEPLOY_FREE.md](./DEPLOY_FREE.md)

**Преимущества:**
- ✅ Работает 24/7
- ✅ Постоянная ссылка (типа `https://your-app.vercel.app`)
- ✅ Не нужно держать компьютер включенным
- ✅ БЕСПЛАТНО!

**Время:** 15-20 минут

---

### 💨 Быстрый доступ (временно)

**Вариант 1: Для людей в той же WiFi сети**
```
Дайте им ссылку: http://192.168.100.73:3000
```

**Вариант 2: Через интернет (ngrok - временная ссылка)**
```bash
# Установите ngrok
npm install -g ngrok

# Запустите скрипт
start-remote.cmd   # Windows
# или
bash start-remote.sh  # Mac/Linux
```

📖 Подробности в [REMOTE_ACCESS.md](./REMOTE_ACCESS.md)

## Usage

### Getting Started
1. **Register**: Create a new account at `http://localhost:3000/register`
2. **Login**: Sign in to your account at `http://localhost:3000/login`
3. **Create Board**: Click "Create Board" to start a new project
4. **Add Columns**: Customize your workflow with columns
5. **Create Cards**: Add tasks and organize them
6. **Invite Team**: Share boards with team members
7. **Drag & Drop**: Move cards between columns effortlessly

### Board Management
- **Create Boards**: Click the "Create Board" button
- **Customize Colors**: Choose from 12 beautiful color themes
- **Add Descriptions**: Provide context for your projects
- **Invite Members**: Share boards via email invitations

### Card Features
- **Priority Levels**: Set high, medium, or low priority
- **Due Dates**: Track deadlines with visual indicators
- **Assignees**: Assign tasks to team members
- **Labels**: Add custom labels for categorization
- **Rich Descriptions**: Detailed task descriptions

### Collaboration
- **Real-time Updates**: Changes sync across all users
- **Role Management**: Admin and member permissions
- **Invitation System**: Email-based team invitations
- **Activity Tracking**: Monitor board activity

## Sharing with Others

### For Team Members:
1. **Register**: Each team member needs to create their own account
2. **Get Invited**: Board owners can invite members via email
3. **Accept Invitation**: Members receive email invitations and can accept them
4. **Collaborate**: All members can view and edit boards they're invited to

### For Deployment:
1. **Frontend**: Deploy React app to Vercel, Netlify, or similar
2. **Backend**: Deploy Node.js app to Heroku, Railway, or similar
3. **Database**: MongoDB Atlas is already cloud-hosted
4. **Environment**: Update API URLs in production

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get specific board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:id/invite` - Invite user to board

### Cards & Columns
- `POST /api/cards/:boardId/columns/:columnId/cards` - Add card
- `PUT /api/cards/:boardId/columns/:columnId/cards/:cardId` - Update card
- `DELETE /api/cards/:boardId/columns/:columnId/cards/:cardId` - Delete card
- `PUT /api/cards/:boardId/move-card` - Move card between columns
- `POST /api/cards/:boardId/columns` - Add column
- `PUT /api/cards/:boardId/columns/:columnId` - Update column
- `DELETE /api/cards/:boardId/columns/:columnId` - Delete column

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String
}
```

### Board Model
```javascript
{
  title: String,
  description: String,
  owner: ObjectId (User),
  members: [{
    user: ObjectId (User),
    role: String (admin/member),
    joinedAt: Date
  }],
  columns: [{
    title: String,
    position: Number,
    cards: [Card]
  }],
  settings: {
    color: String,
    background: String
  }
}
```

### Card Model
```javascript
{
  title: String,
  description: String,
  position: Number,
  assignee: ObjectId (User),
  dueDate: Date,
  priority: String (low/medium/high),
  labels: [String]
}
```

## 📚 Документация

- 🔧 **[Решение проблем](./TROUBLESHOOTING.md)** - Если что-то не работает
- 🌍 **[Удаленный доступ](./REMOTE_ACCESS.md)** - Доступ через интернет
- 🚀 **[Быстрый старт удаленно](./QUICK_START_REMOTE.md)** - 5 минут до доступа
- 📝 **[Команды деплоя](./DEPLOY_COMMANDS.md)** - Все команды в одном месте
- 🌐 **[Настройка сети](./NETWORK_SETUP.md)** - Настройка для локальной сети

## Скрипты

| Скрипт | Описание |
|--------|----------|
| `.\start.cmd` | Запуск приложения (автоматически освобождает порты) |
| `.\kill-ports.cmd` | Освободить порты 3000 и 5000 |
| `.\start-remote.cmd` | Запуск с ngrok для удаленного доступа |
| `npm run dev` | Запуск в dev режиме |
| `npm run install-all` | Установка всех зависимостей |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@kanbanboard.com or create an issue in the repository.

---

Built with ❤️ using React, Node.js, and MongoDB Atlas