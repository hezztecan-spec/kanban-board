import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ref, set, get, push, update, remove, onValue } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from './AuthContext';
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
    default:
      return state;
  }
};

export const BoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.uid) {
      dispatch({ type: 'SET_BOARDS', payload: [] });
      return;
    }

    const boardsRef = ref(database, 'boards');
    const unsubscribe = onValue(boardsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const boardsArray = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(board => {
            // Show board if user is owner
            if (board.owner === user.uid) return true;
            
            // Show board if user is in members array
            if (board.members && Array.isArray(board.members)) {
              return board.members.some(m => m.userId === user.uid);
            }
            
            return false;
          });
        dispatch({ type: 'SET_BOARDS', payload: boardsArray });
      } else {
        dispatch({ type: 'SET_BOARDS', payload: [] });
      }
    }, (error) => {
      console.error('Firebase read error:', error);
      toast.error('Failed to load boards. Check Firebase rules!');
      dispatch({ type: 'SET_BOARDS', payload: [] });
    });

    return () => unsubscribe();
  }, [user]);

  const fetchBoards = async () => {
    // Real-time listener handles this
  };

  const fetchBoard = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const boardRef = ref(database, `boards/${id}`);
      const snapshot = await get(boardRef);
      
      if (snapshot.exists()) {
        const board = { id, ...snapshot.val() };
        dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
      } else {
        toast.error('Board not found');
      }
    } catch (error) {
      toast.error('Failed to fetch board');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createBoard = async (boardData) => {
    try {
      const boardsRef = ref(database, 'boards');
      const newBoardRef = push(boardsRef);
      
      const board = {
        ...boardData,
        owner: user.uid,
        members: [{
          userId: user.uid,
          name: user.name,
          role: 'admin',
          joinedAt: new Date().toISOString()
        }],
        columns: [
          { id: 'col1', title: 'To Do', position: 0, cards: [] },
          { id: 'col2', title: 'In Progress', position: 1, cards: [] },
          { id: 'col3', title: 'Done', position: 2, cards: [] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await set(newBoardRef, board);
      toast.success('Board created successfully!');
      return { id: newBoardRef.key, ...board };
    } catch (error) {
      toast.error('Failed to create board');
      throw error;
    }
  };

  const updateBoard = async (id, boardData) => {
    try {
      const boardRef = ref(database, `boards/${id}`);
      const updates = {
        ...boardData,
        updatedAt: new Date().toISOString()
      };
      
      await update(boardRef, updates);
      toast.success('Board updated successfully!');
      
      // Refresh current board
      if (state.currentBoard?.id === id) {
        await fetchBoard(id);
      }
      
      return updates;
    } catch (error) {
      toast.error('Failed to update board');
      throw error;
    }
  };

  const deleteBoard = async (id) => {
    try {
      const boardRef = ref(database, `boards/${id}`);
      await remove(boardRef);
      toast.success('Board deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete board');
      throw error;
    }
  };

  const addCard = async (boardId, columnId, cardData) => {
    try {
      const boardRef = ref(database, `boards/${boardId}`);
      const snapshot = await get(boardRef);
      const board = snapshot.val();

      const columns = board.columns.map(col => {
        if (col.id === columnId) {
          const newCard = {
            id: `card-${Date.now()}`,
            ...cardData,
            position: col.cards?.length || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return {
            ...col,
            cards: [...(col.cards || []), newCard]
          };
        }
        return col;
      });

      await update(boardRef, { 
        columns,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Card added successfully!');
      await fetchBoard(boardId);
    } catch (error) {
      toast.error('Failed to add card');
      throw error;
    }
  };

  const updateCard = async (boardId, columnId, cardId, cardData) => {
    try {
      const boardRef = ref(database, `boards/${boardId}`);
      const snapshot = await get(boardRef);
      const board = snapshot.val();

      const columns = board.columns.map(col => {
        if (col.id === columnId) {
          const cards = col.cards.map(card => 
            card.id === cardId 
              ? { ...card, ...cardData, updatedAt: new Date().toISOString() }
              : card
          );
          return { ...col, cards };
        }
        return col;
      });

      await update(boardRef, { 
        columns,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Card updated successfully!');
      await fetchBoard(boardId);
    } catch (error) {
      toast.error('Failed to update card');
      throw error;
    }
  };

  const deleteCard = async (boardId, columnId, cardId) => {
    try {
      const boardRef = ref(database, `boards/${boardId}`);
      const snapshot = await get(boardRef);
      const board = snapshot.val();

      const columns = board.columns.map(col => {
        if (col.id === columnId) {
          const cards = col.cards.filter(card => card.id !== cardId);
          return { ...col, cards };
        }
        return col;
      });

      await update(boardRef, { 
        columns,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Card deleted successfully!');
      await fetchBoard(boardId);
    } catch (error) {
      toast.error('Failed to delete card');
      throw error;
    }
  };

  const moveCard = async (boardId, moveData) => {
    try {
      const { cardId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = moveData;
      
      const boardRef = ref(database, `boards/${boardId}`);
      const snapshot = await get(boardRef);
      const board = snapshot.val();

      let movedCard = null;
      
      // Remove card from source column
      const columns = board.columns.map(col => {
        if (col.id === sourceColumnId) {
          movedCard = col.cards.find(card => card.id === cardId);
          const cards = col.cards.filter(card => card.id !== cardId);
          return { ...col, cards };
        }
        return col;
      });

      // Add card to destination column
      const finalColumns = columns.map(col => {
        if (col.id === destinationColumnId) {
          const cards = [...(col.cards || [])];
          cards.splice(destinationIndex, 0, movedCard);
          return { ...col, cards };
        }
        return col;
      });

      await update(boardRef, { 
        columns: finalColumns,
        updatedAt: new Date().toISOString()
      });
      
      await fetchBoard(boardId);
      return { id: boardId, ...board, columns: finalColumns };
    } catch (error) {
      toast.error('Failed to move card');
      throw error;
    }
  };

  const addColumn = async (boardId, columnData) => {
    try {
      const boardRef = ref(database, `boards/${boardId}`);
      const snapshot = await get(boardRef);
      const board = snapshot.val();

      const newColumn = {
        id: `col-${Date.now()}`,
        ...columnData,
        position: board.columns?.length || 0,
        cards: []
      };

      const columns = [...(board.columns || []), newColumn];

      await update(boardRef, { 
        columns,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Column added successfully!');
      await fetchBoard(boardId);
    } catch (error) {
      toast.error('Failed to add column');
      throw error;
    }
  };

  const updateColumn = async (boardId, columnId, columnData) => {
    try {
      const boardRef = ref(database, `boards/${boardId}`);
      const snapshot = await get(boardRef);
      const board = snapshot.val();

      const columns = board.columns.map(col => 
        col.id === columnId ? { ...col, ...columnData } : col
      );

      await update(boardRef, { 
        columns,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Column updated successfully!');
      await fetchBoard(boardId);
    } catch (error) {
      toast.error('Failed to update column');
      throw error;
    }
  };

  const deleteColumn = async (boardId, columnId) => {
    try {
      const boardRef = ref(database, `boards/${boardId}`);
      const snapshot = await get(boardRef);
      const board = snapshot.val();

      const columns = board.columns.filter(col => col.id !== columnId);

      await update(boardRef, { 
        columns,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Column deleted successfully!');
      await fetchBoard(boardId);
    } catch (error) {
      toast.error('Failed to delete column');
      throw error;
    }
  };

  const inviteUser = async (boardId, invitationData) => {
    try {
      const { email, role } = invitationData;
      
      // Find user by email
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      const users = snapshot.val();
      
      let foundUserId = null;
      let foundUserName = null;
      
      if (users) {
        Object.keys(users).forEach(uid => {
          if (users[uid].email === email) {
            foundUserId = uid;
            foundUserName = users[uid].name;
          }
        });
      }
      
      if (!foundUserId) {
        toast.error('User with this email not found. They need to register first!');
        return;
      }
      
      // Check if user already a member
      const boardRef = ref(database, `boards/${boardId}`);
      const boardSnapshot = await get(boardRef);
      const board = boardSnapshot.val();
      
      if (board.members && board.members.some(m => m.userId === foundUserId)) {
        toast.error('User is already a member of this board!');
        return;
      }
      
      // Add user to board members
      const newMember = {
        userId: foundUserId,
        name: foundUserName,
        role: role || 'member',
        joinedAt: new Date().toISOString()
      };
      
      const updatedMembers = [...(board.members || []), newMember];
      
      await update(boardRef, { 
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`${foundUserName} added to board!`);
      
      // Refresh board
      await fetchBoard(boardId);
      
      return { success: true };
    } catch (error) {
      console.error('Invite user error:', error);
      toast.error('Failed to add user to board');
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
