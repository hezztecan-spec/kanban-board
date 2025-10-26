import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBoard } from '../contexts/BoardContext';
import { motion } from 'framer-motion';
import { Plus, Users, LogOut, Search, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import CreateBoardModal from './modals/CreateBoardModal';
import InviteModal from './modals/InviteModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { boards, fetchBoards, loading } = useBoard();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'shared'

  useEffect(() => {
    fetchBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = boards;
    
    // Filter by tab
    if (activeTab === 'my') {
      filtered = boards.filter(board => board.owner === user?.uid);
    } else {
      filtered = boards.filter(board => 
        board.owner !== user?.uid && 
        board.members?.some(m => m.userId === user?.uid)
      );
    }
    
    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(board =>
        board.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBoards(filtered);
  }, [boards, searchTerm, activeTab, user]);
  
  const calculateBoardProgress = (board) => {
    if (!board.columns || board.columns.length === 0) return 0;
    
    let totalCards = 0;
    let completedCards = 0;
    
    board.columns.forEach(column => {
      if (column.cards && column.cards.length > 0) {
        totalCards += column.cards.length;
        // Считаем карточки в последней колонке как завершенные
        if (column.position === board.columns.length - 1 || 
            column.title.toLowerCase().includes('done') ||
            column.title.toLowerCase().includes('готово')) {
          completedCards += column.cards.length;
        }
      }
    });
    
    return totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;
  };
  
  const myBoards = boards.filter(board => board.owner === user?.uid);
  const sharedBoards = boards.filter(board => 
    board.owner !== user?.uid && 
    board.members?.some(m => m.userId === user?.uid)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBoardColor = (color) => {
    return color || '#0ea5e9';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-3"
              >
                <span className="text-lg font-bold text-white">K</span>
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900">Канбан Доски</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {getInitials(user?.name || 'U')}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Мои доски</p>
                <p className="text-3xl font-bold text-gray-900">{myBoards.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Приглашенные</p>
                <p className="text-3xl font-bold text-gray-900">{sharedBoards.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Всего досок</p>
                <p className="text-3xl font-bold text-gray-900">{boards.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'my'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Мои доски ({myBoards.length})
            {activeTab === 'my' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'shared'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Приглашенные ({sharedBoards.length})
            {activeTab === 'shared' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
              />
            )}
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск досок..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInviteModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Пригласить</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Создать доску</span>
            </motion.button>
          </div>
        </div>

        {/* Boards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBoards.map((board, index) => (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => navigate(`/board/${board.id}`)}
                className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getBoardColor(board.settings?.color) }}
                  >
                    {board.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{board.members.length}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {board.title}
                </h3>
                
                {board.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {board.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Прогресс</span>
                    <span className="font-semibold">{calculateBoardProgress(board)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateBoardProgress(board)}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        calculateBoardProgress(board) === 100 
                          ? 'bg-green-500' 
                          : calculateBoardProgress(board) > 50 
                          ? 'bg-blue-500' 
                          : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{board.columns?.length || 0} колонок</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {board.updatedAt ? new Date(board.updatedAt).toLocaleDateString('ru-RU') : 'Сейчас'}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Create Board Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredBoards.length * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setShowCreateModal(true)}
              className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-primary-400 group"
            >
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-primary-600 transition-colors">
                  Создать новую доску
                </h3>
                <p className="text-gray-500 text-sm">
                  Начните организовывать свои проекты
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {filteredBoards.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {activeTab === 'my' ? 'Нет досок' : 'Нет приглашенных досок'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос' 
                : activeTab === 'my' 
                ? 'Создайте свою первую доску' 
                : 'Вас еще не пригласили ни на одну доску'}
            </p>
            {!searchTerm && activeTab === 'my' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Создать доску
              </motion.button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
