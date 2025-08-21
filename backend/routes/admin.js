const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/dashboard - Get admin dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Get contact statistics
    const contactStats = await Contact.getStats();
    
    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email projectType status createdAt');
    
    // Get user info
    const user = await User.findById(req.user.userId).select('-password');
    
    res.json({
      success: true,
      data: {
        user,
        stats: contactStats,
        recentContacts,
        dashboard: {
          totalContacts: contactStats.total,
          newContacts: contactStats.new,
          readContacts: contactStats.read,
          repliedContacts: contactStats.replied,
          archivedContacts: contactStats.archived
        }
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to get dashboard data',
      message: 'Please try again later.'
    });
  }
});

// GET /api/admin/contacts - Get all contacts with pagination and filtering
router.get('/contacts', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    let query = {};
    
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contacts = await Contact.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      error: 'Failed to get contacts',
      message: 'Please try again later.'
    });
  }
});

// GET /api/admin/contacts/:id - Get specific contact details
router.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found',
        message: 'The requested contact message could not be found.'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
    
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      error: 'Failed to get contact',
      message: 'Please try again later.'
    });
  }
});

// PATCH /api/admin/contacts/:id/status - Update contact status
router.patch('/contacts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: new, read, replied, archived'
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found',
        message: 'The requested contact message could not be found.'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
    
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      error: 'Failed to update status',
      message: 'Please try again later.'
    });
  }
});

// DELETE /api/admin/contacts/:id - Delete contact (soft delete by archiving)
router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found',
        message: 'The requested contact message could not be found.'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact archived successfully',
      data: contact
    });
    
  } catch (error) {
    console.error('Archive contact error:', error);
    res.status(500).json({
      error: 'Failed to archive contact',
      message: 'Please try again later.'
    });
  }
});

// POST /api/admin/contacts/:id/reply - Send reply to contact
router.post('/contacts/:id/reply', async (req, res) => {
  try {
    const { replyMessage } = req.body;
    
    if (!replyMessage || replyMessage.trim().length === 0) {
      return res.status(400).json({
        error: 'Reply message required',
        message: 'Please provide a reply message'
      });
    }
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found',
        message: 'The requested contact message could not be found.'
      });
    }
    
    // Update status to replied
    contact.status = 'replied';
    await contact.save();
    
    // TODO: Send email reply to the contact
    // This would integrate with your email service
    
    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        contactId: contact._id,
        status: contact.status,
        repliedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Send reply error:', error);
    res.status(500).json({
      error: 'Failed to send reply',
      message: 'Please try again later.'
    });
  }
});

// GET /api/admin/profile - Get admin profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile could not be found.'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Please try again later.'
    });
  }
});

// PATCH /api/admin/profile - Update admin profile
router.patch('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Please try again later.'
    });
  }
});

module.exports = router;

