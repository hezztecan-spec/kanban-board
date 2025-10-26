const express = require('express');
const { body, validationResult } = require('express-validator');
const Board = require('../models/Board');
const auth = require('../middleware/auth');

const router = express.Router();

// Add card to column
router.post('/:boardId/columns/:columnId/cards', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const { title, description, assignee, dueDate, priority, labels } = req.body;

    const newCard = {
      title,
      description: description || '',
      position: column.cards.length,
      assignee: assignee || null,
      dueDate: dueDate || null,
      priority: priority || 'medium',
      labels: labels || []
    };

    column.cards.push(newCard);
    await board.save();

    await board.populate('columns.cards.assignee', 'name email');
    res.json(board);
  } catch (error) {
    console.error('Add card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update card
router.put('/:boardId/columns/:columnId/cards/:cardId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const card = column.cards.id(req.params.cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const { title, description, assignee, dueDate, priority, labels } = req.body;

    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;
    if (assignee !== undefined) card.assignee = assignee;
    if (dueDate !== undefined) card.dueDate = dueDate;
    if (priority !== undefined) card.priority = priority;
    if (labels !== undefined) card.labels = labels;

    card.updatedAt = new Date();
    await board.save();

    await board.populate('columns.cards.assignee', 'name email');
    res.json(board);
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete card
router.delete('/:boardId/columns/:columnId/cards/:cardId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const card = column.cards.id(req.params.cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    card.remove();
    await board.save();

    res.json(board);
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Move card between columns
router.put('/:boardId/move-card', auth, [
  body('cardId').isMongoId().withMessage('Valid card ID is required'),
  body('sourceColumnId').isMongoId().withMessage('Valid source column ID is required'),
  body('destinationColumnId').isMongoId().withMessage('Valid destination column ID is required'),
  body('sourceIndex').isInt({ min: 0 }).withMessage('Valid source index is required'),
  body('destinationIndex').isInt({ min: 0 }).withMessage('Valid destination index is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const { cardId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = req.body;

    const sourceColumn = board.columns.id(sourceColumnId);
    const destinationColumn = board.columns.id(destinationColumnId);

    if (!sourceColumn || !destinationColumn) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const card = sourceColumn.cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Remove card from source column
    card.remove();

    // Add card to destination column at specified position
    destinationColumn.cards.splice(destinationIndex, 0, card);

    // Update positions
    sourceColumn.cards.forEach((c, index) => {
      c.position = index;
    });

    destinationColumn.cards.forEach((c, index) => {
      c.position = index;
    });

    await board.save();
    await board.populate('columns.cards.assignee', 'name email');

    res.json(board);
  } catch (error) {
    console.error('Move card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add column
router.post('/:boardId/columns', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or insufficient permissions' });
    }

    const { title } = req.body;
    const position = board.columns.length;

    board.columns.push({
      title,
      position,
      cards: []
    });

    await board.save();
    res.json(board);
  } catch (error) {
    console.error('Add column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update column
router.put('/:boardId/columns/:columnId', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or insufficient permissions' });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const { title } = req.body;
    column.title = title;

    await board.save();
    res.json(board);
  } catch (error) {
    console.error('Update column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete column
router.delete('/:boardId/columns/:columnId', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or insufficient permissions' });
    }

    const column = board.columns.id(req.params.columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    column.remove();
    await board.save();

    res.json(board);
  } catch (error) {
    console.error('Delete column error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
