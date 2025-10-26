# Kanban Board Application

A beautiful, modern Kanban board application built with React and Node.js, featuring drag-and-drop functionality, real-time collaboration, and a stunning UI.

## 🎯 Быстрый старт

### 🔥 Проект на Firebase!

**Всё очень просто:** 👉 **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

- ✅ Полностью бесплатно
- ✅ Деплой за 5 минут
- ✅ Реальное время из коробки

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
- **Firebase**: Complete backend solution
  - **Firebase Authentication**: User auth
  - **Firebase Realtime Database**: Real-time data sync
  - **Firebase Hosting**: Free hosting with CDN

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Firebase account (free tier available)
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

3. **Firebase Setup**
Firebase is already configured! Just enable Authentication and set Database Rules. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

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

## 🌍 Деплой на Firebase (Рекомендуется!)

**5 минут до полностью работающего приложения!**

📖 **Полная инструкция:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**Преимущества Firebase:**
- ✅ Полностью бесплатно
- ✅ Автоматическая синхронизация в реальном времени
- ✅ HTTPS по умолчанию
- ✅ CDN по всему миру
- ✅ Не нужен отдельный backend сервер

**Быстрая команда:**
```bash
npm install -g firebase-tools
firebase login
firebase init
cd client && npm run build && cd ..
firebase deploy
```

Получите ссылку типа: `https://kanban-board-ae545.web.app` 🔥

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

- 🔥 **[Firebase Setup](./FIREBASE_SETUP.md)** - Деплой на Firebase
- 🔧 **[Решение проблем](./TROUBLESHOOTING.md)** - Если что-то не работает

## Скрипты

| Скрипт | Описание |
|--------|----------|
| `.\start.cmd` | Запуск приложения локально |
| `.\kill-ports.cmd` | Освободить порты 3000 и 5000 |
| `cd client && npm start` | Запуск только frontend |
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