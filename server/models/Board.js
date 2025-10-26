const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  columns: [{
    title: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    cards: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      position: {
        type: Number,
        required: true
      },
      assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      dueDate: {
        type: Date,
        default: null
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      labels: [{
        type: String,
        trim: true
      }],
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  settings: {
    color: {
      type: String,
      default: '#0ea5e9'
    },
    background: {
      type: String,
      default: 'default'
    }
  }
}, {
  timestamps: true
});

// Index for better performance
boardSchema.index({ owner: 1 });
boardSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Board', boardSchema);
