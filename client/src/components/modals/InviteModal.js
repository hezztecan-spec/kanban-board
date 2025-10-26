import React, { useState } from 'react';
import { useBoard } from '../../contexts/BoardContext';
import { motion } from 'framer-motion';
import { X, Mail, User, Shield } from 'lucide-react';

const InviteModal = ({ boardId, onClose }) => {
  const { inviteUser } = useBoard();
  const [formData, setFormData] = useState({
    email: '',
    role: 'member'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    setLoading(true);
    try {
      await inviteUser(boardId, formData);
      onClose();
    } catch (error) {
      console.error('Invite user error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add User to Board</h2>
            <p className="text-sm text-gray-500 mt-1">User must already be registered</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter registered user's email"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">They need to register first at the login page</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="member"
                  checked={formData.role === 'member'}
                  onChange={handleChange}
                  className="text-primary-600"
                />
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Member</div>
                    <div className="text-sm text-gray-500">Can view and edit cards</div>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="text-primary-600"
                />
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Admin</div>
                    <div className="text-sm text-gray-500">Can manage board settings and invite users</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !formData.email.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add to Board'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InviteModal;
