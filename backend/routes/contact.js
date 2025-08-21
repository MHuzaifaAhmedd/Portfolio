const express = require('express');
const Contact = require('../models/Contact');
const { validateContact } = require('../middleware/validation');
const { sendContactEmail } = require('../utils/email');
const router = express.Router();

// Rate limiting for contact submissions
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact submissions from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Submit contact form
router.post('/', contactLimiter, validateContact, async (req, res) => {
  try {
    const { name, email, projectType, message } = req.body;

    // Create new contact
    const contact = new Contact({
      name,
      email,
      projectType,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contact.save();

    // Send email notification to admin
    try {
      await sendContactEmail(contact);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        projectType: contact.projectType,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.'
    });
  }
});

// Get contact statistics (public)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Contact.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Get recent contacts (public, limited)
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const contacts = await Contact.find({ status: { $ne: 'archived' } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name projectType createdAt status');

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Recent contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent contacts'
    });
  }
});

// Get specific contact by ID (public, limited info)
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .select('name projectType createdAt status');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Contact fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    });
  }
});

// Update contact status (public, limited)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['new', 'read', 'replied', 'archived'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('name projectType createdAt status');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

module.exports = router;
