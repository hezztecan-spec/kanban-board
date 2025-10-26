import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Boards API
export const boardsAPI = {
  getBoards: () => api.get('/boards'),
  getBoard: (id) => api.get(`/boards/${id}`),
  createBoard: (boardData) => api.post('/boards', boardData),
  updateBoard: (id, boardData) => api.put(`/boards/${id}`, boardData),
  deleteBoard: (id) => api.delete(`/boards/${id}`),
  inviteUser: (id, invitationData) => api.post(`/boards/${id}/invite`, invitationData),
  acceptInvitation: (token) => api.post(`/boards/invite/${token}/accept`),
};

// Cards API
export const cardsAPI = {
  addCard: (boardId, columnId, cardData) => 
    api.post(`/cards/${boardId}/columns/${columnId}/cards`, cardData),
  updateCard: (boardId, columnId, cardId, cardData) => 
    api.put(`/cards/${boardId}/columns/${columnId}/cards/${cardId}`, cardData),
  deleteCard: (boardId, columnId, cardId) => 
    api.delete(`/cards/${boardId}/columns/${columnId}/cards/${cardId}`),
  moveCard: (boardId, moveData) => 
    api.put(`/cards/${boardId}/move-card`, moveData),
  addColumn: (boardId, columnData) => 
    api.post(`/cards/${boardId}/columns`, columnData),
  updateColumn: (boardId, columnId, columnData) => 
    api.put(`/cards/${boardId}/columns/${columnId}`, columnData),
  deleteColumn: (boardId, columnId) => 
    api.delete(`/cards/${boardId}/columns/${columnId}`),
};

export default api;
