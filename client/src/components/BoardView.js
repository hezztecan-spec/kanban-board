import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useBoard } from '../contexts/BoardContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Settings, 
  Calendar,
  User,
  Flag,
  Tag,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import CreateCardModal from './modals/CreateCardModal';
import EditCardModal from './modals/EditCardModal';
import InviteModal from './modals/InviteModal';
import EditBoardModal from './modals/EditBoardModal';

const BoardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBoard, fetchBoard, moveCard, addColumn, updateColumn, deleteColumn } = useBoard();
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    if (id) {
      fetchBoard(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      await moveCard(id, {
        cardId: draggableId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      });
    } catch (error) {
      console.error('Move card error:', error);
    }
  };

  const handleCreateCard = (columnId) => {
    setSelectedColumn(columnId);
    setShowCreateCard(true);
  };

  const handleEditCard = (card, columnId) => {
    setSelectedCard({ ...card, columnId });
    setShowEditCard(true);
  };


  const handleAddColumn = () => {
    setNewColumnTitle('');
    setEditingColumn('new');
  };

  const handleSaveColumn = async () => {
    if (!newColumnTitle.trim()) return;

    try {
      if (editingColumn === 'new') {
        await addColumn(id, { title: newColumnTitle.trim() });
      } else {
        await updateColumn(id, editingColumn, { title: newColumnTitle.trim() });
      }
      setEditingColumn(null);
      setNewColumnTitle('');
    } catch (error) {
      console.error('Save column error:', error);
    }
  };

  const handleEditColumn = (columnId, currentTitle) => {
    setEditingColumn(columnId);
    setNewColumnTitle(currentTitle);
  };

  const handleDeleteColumn = async (columnId) => {
    if (window.confirm('Are you sure you want to delete this column? All cards will be deleted.')) {
      try {
        await deleteColumn(id, columnId);
      } catch (error) {
        console.error('Delete column error:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    const now = new Date();
    const cardDate = new Date(date);
    const diffTime = cardDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-yellow-600' };
    return { text: `${diffDays} days left`, color: 'text-gray-600' };
  };

  if (!currentBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: currentBoard.settings?.color || '#0ea5e9' }}
                >
                  {currentBoard.title.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{currentBoard.title}</h1>
                  {currentBoard.description && (
                    <p className="text-sm text-gray-600">{currentBoard.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm">{currentBoard.members.length} members</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInviteModal(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Invite</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEditBoard(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {currentBoard.columns.map((column, columnIndex) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: columnIndex * 0.1 }}
                className="flex-shrink-0 w-80"
              >
                <div className="card p-4 h-full">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    {editingColumn === column.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={newColumnTitle}
                          onChange={(e) => setNewColumnTitle(e.target.value)}
                          className="input-field flex-1"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveColumn()}
                        />
                        <button
                          onClick={handleSaveColumn}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingColumn(null)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900">{column.title}</h3>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditColumn(column.id, column.title)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteColumn(column.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Cards */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] space-y-3 ${
                          snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg' : ''
                        }`}
                      >
                        {column.cards.map((card, cardIndex) => (
                          <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                whileHover={{ scale: 1.02 }}
                                className={`card p-4 cursor-pointer ${
                                  snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                }`}
                                onClick={() => handleEditCard(card, column._id)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 text-sm">{card.title}</h4>
                                  <div className="flex items-center space-x-1">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(card.priority)}`}>
                                      <Flag className="w-3 h-3 inline mr-1" />
                                      {card.priority}
                                    </span>
                                  </div>
                                </div>

                                {card.description && (
                                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {card.description}
                                  </p>
                                )}

                                {card.labels && card.labels.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {card.labels.map((label, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                      >
                                        <Tag className="w-3 h-3 inline mr-1" />
                                        {label}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center space-x-2">
                                    {card.assignee && (
                                      <div className="flex items-center space-x-1">
                                        <User className="w-3 h-3" />
                                        <span>{card.assignee.name}</span>
                                      </div>
                                    )}
                                  </div>
                                  {card.dueDate && (
                                    <div className={`flex items-center space-x-1 ${formatDate(card.dueDate).color}`}>
                                      <Calendar className="w-3 h-3" />
                                      <span>{formatDate(card.dueDate).text}</span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Add Card Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCreateCard(column.id)}
                          className="w-full p-3 text-gray-500 hover:text-gray-700 border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add a card</span>
                        </motion.button>
                      </div>
                    )}
                  </Droppable>
                </div>
              </motion.div>
            ))}

            {/* Add Column */}
            {editingColumn === 'new' ? (
              <div className="flex-shrink-0 w-80">
                <div className="card p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      placeholder="Column title"
                      className="input-field flex-1"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveColumn()}
                    />
                    <button
                      onClick={handleSaveColumn}
                      className="p-2 text-green-600 hover:text-green-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingColumn(null)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 w-80"
              >
                <button
                  onClick={handleAddColumn}
                  className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-lg flex items-center justify-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add a column</span>
                </button>
              </motion.div>
            )}
          </div>
        </DragDropContext>
      </main>

      {/* Modals */}
      {showCreateCard && (
        <CreateCardModal
          boardId={id}
          columnId={selectedColumn}
          onClose={() => setShowCreateCard(false)}
        />
      )}

      {showEditCard && (
        <EditCardModal
          boardId={id}
          columnId={selectedCard.columnId}
          card={selectedCard}
          onClose={() => setShowEditCard(false)}
        />
      )}

      {showInviteModal && (
        <InviteModal
          boardId={id}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {showEditBoard && (
        <EditBoardModal
          board={currentBoard}
          onClose={() => setShowEditBoard(false)}
        />
      )}
    </div>
  );
};

export default BoardView;
