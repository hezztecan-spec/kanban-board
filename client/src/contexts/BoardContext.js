import React, { createContext, useContext, useReducer } from 'react';
import { boardsAPI, cardsAPI } from '../services/api';
import toast from 'react-hot-toast';

const BoardContext = createContext();

const initialState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_BOARDS':
      return { ...state, boards: action.payload, loading: false };
    case 'SET_CURRENT_BOARD':
      return { ...state, currentBoard: action.payload, loading: false };
    case 'ADD_BOARD':
      return { ...state, boards: [action.payload, ...state.boards] };
    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board._id === action.payload._id ? action.payload : board
        ),
        currentBoard: state.currentBoard?._id === action.payload._id ? action.payload : state.currentBoard,
      };
    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(board => board._id !== action.payload),
        currentBoard: state.currentBoard?._id === action.payload ? null : state.currentBoard,
      };
    case 'MOVE_CARD':
      return {
        ...state,
        currentBoard: action.payload,
      };
    default:
      return state;
  }
};

export const BoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const fetchBoards = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await boardsAPI.getBoards();
      dispatch({ type: 'SET_BOARDS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch boards' });
      toast.error('Failed to fetch boards');
    }
  };

  const fetchBoard = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await boardsAPI.getBoard(id);
      dispatch({ type: 'SET_CURRENT_BOARD', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch board' });
      toast.error('Failed to fetch board');
    }
  };

  const createBoard = async (boardData) => {
    try {
      const response = await boardsAPI.createBoard(boardData);
      dispatch({ type: 'ADD_BOARD', payload: response.data });
      toast.success('Board created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create board');
      throw error;
    }
  };

  const updateBoard = async (id, boardData) => {
    try {
      const response = await boardsAPI.updateBoard(id, boardData);
      dispatch({ type: 'UPDATE_BOARD', payload: response.data });
      toast.success('Board updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update board');
      throw error;
    }
  };

  const deleteBoard = async (id) => {
    try {
      await boardsAPI.deleteBoard(id);
      dispatch({ type: 'DELETE_BOARD', payload: id });
      toast.success('Board deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete board');
      throw error;
    }
  };

  const inviteUser = async (boardId, invitationData) => {
    try {
      const response = await boardsAPI.inviteUser(boardId, invitationData);
      toast.success('Invitation sent successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
      throw error;
    }
  };

  const addCard = async (boardId, columnId, cardData) => {
    try {
      const response = await cardsAPI.addCard(boardId, columnId, cardData);
      dispatch({ type: 'SET_CURRENT_BOARD', payload: response.data });
      toast.success('Card added successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add card');
      throw error;
    }
  };

  const updateCard = async (boardId, columnId, cardId, cardData) => {
    try {
      const response = await cardsAPI.updateCard(boardId, columnId, cardId, cardData);
      dispatch({ type: 'SET_CURRENT_BOARD', payload: response.data });
      toast.success('Card updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update card');
      throw error;
    }
  };

  const deleteCard = async (boardId, columnId, cardId) => {
    try {
      const response = await cardsAPI.deleteCard(boardId, columnId, cardId);
      dispatch({ type: 'SET_CURRENT_BOARD', payload: response.data });
      toast.success('Card deleted successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete card');
      throw error;
    }
  };

  const moveCard = async (boardId, moveData) => {
    try {
      const response = await cardsAPI.moveCard(boardId, moveData);
      dispatch({ type: 'MOVE_CARD', payload: response.data });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to move card');
      throw error;
    }
  };

  const addColumn = async (boardId, columnData) => {
    try {
      const response = await cardsAPI.addColumn(boardId, columnData);
      dispatch({ type: 'SET_CURRENT_BOARD', payload: response.data });
      toast.success('Column added successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add column');
      throw error;
    }
  };

  const updateColumn = async (boardId, columnId, columnData) => {
    try {
      const response = await cardsAPI.updateColumn(boardId, columnId, columnData);
      dispatch({ type: 'SET_CURRENT_BOARD', payload: response.data });
      toast.success('Column updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update column');
      throw error;
    }
  };

  const deleteColumn = async (boardId, columnId) => {
    try {
      const response = await cardsAPI.deleteColumn(boardId, columnId);
      dispatch({ type: 'SET_CURRENT_BOARD', payload: response.data });
      toast.success('Column deleted successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete column');
      throw error;
    }
  };

  const value = {
    ...state,
    fetchBoards,
    fetchBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    inviteUser,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addColumn,
    updateColumn,
    deleteColumn,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
