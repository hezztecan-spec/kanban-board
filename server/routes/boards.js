const express = require('express');
const { body, validationResult } = require('express-validator');
const Board = require('../models/Board');
const User = require('../models/User');
const Invitation = require('../models/Invitation');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all boards for user
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).populate('owner', 'name email')
      .populate('members.user', 'name email')
      .sort({ updatedAt: -1 });

    res.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new board
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, color } = req.body;

    const board = new Board({
      title,
      description: description || '',
      owner: req.user._id,
      members: [{
        user: req.user._id,
        role: 'admin'
      }],
      columns: [
        { title: 'To Do', position: 0, cards: [] },
        { title: 'In Progress', position: 1, cards: [] },
        { title: 'Done', position: 2, cards: [] }
      ],
      settings: {
        color: color || '#0ea5e9',
        background: 'default'
      }
    });

    await board.save();
    await board.populate('owner', 'name email');
    await board.populate('members.user', 'name email');

    res.status(201).json(board);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single board
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('columns.cards.assignee', 'name email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update board
router.put('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or insufficient permissions' });
    }

    const { title, description, settings } = req.body;

    if (title) board.title = title;
    if (description !== undefined) board.description = description;
    if (settings) board.settings = { ...board.settings, ...settings };

    await board.save();
    await board.populate('owner', 'name email');
    await board.populate('members.user', 'name email');

    res.json(board);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete board
router.delete('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or insufficient permissions' });
    }

    await Board.findByIdAndDelete(req.params.id);
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite user to board
router.post('/:id/invite', auth, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').isIn(['admin', 'member']).withMessage('Role must be admin or member')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or insufficient permissions' });
    }

    const { email, role } = req.body;

    // Check if user is already a member
    const existingMember = board.members.find(member => 
      member.user.toString() === email || member.user.email === email
    );

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this board' });
    }

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({
      board: board._id,
      email,
      status: 'pending'
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'Invitation already sent to this email' });
    }

    // Create invitation
    const invitation = new Invitation({
      board: board._id,
      inviter: req.user._id,
      email,
      role,
      token: uuidv4()
    });

    await invitation.save();

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept invitation
router.post('/invite/:token/accept', auth, async (req, res) => {
  try {
    const invitation = await Invitation.findOne({
      token: req.params.token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('board');

    if (!invitation) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    // Check if user email matches invitation email
    if (req.user.email !== invitation.email) {
      return res.status(400).json({ message: 'This invitation is not for your account' });
    }

    // Add user to board members
    const board = invitation.board;
    board.members.push({
      user: req.user._id,
      role: invitation.role
    });

    await board.save();

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    res.json({ message: 'Invitation accepted successfully', board });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
