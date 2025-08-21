// Validation middleware for contact form
const validateContact = (req, res, next) => {
  const { name, email, projectType, message } = req.body;
  const errors = [];
  
  // Validate name
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }
  
  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  // Validate project type
  if (!projectType || projectType.trim().length === 0) {
    errors.push('Project type is required');
  } else {
    const validTypes = ['web-development', 'mobile-app', 'ai-ml', 'consulting', 'other'];
    if (!validTypes.includes(projectType)) {
      errors.push('Please select a valid project type');
    }
  }
  
  // Validate message
  if (!message || message.trim().length === 0) {
    errors.push('Message is required');
  } else if (message.trim().length > 1000) {
    errors.push('Message cannot exceed 1000 characters');
  }
  
  // Check for spam indicators
  const spamIndicators = [
    'buy now', 'click here', 'free money', 'make money fast',
    'weight loss', 'viagra', 'casino', 'lottery', 'inheritance'
  ];
  
  const messageLower = message.toLowerCase();
  const hasSpam = spamIndicators.some(indicator => messageLower.includes(indicator));
  
  if (hasSpam) {
    errors.push('Message contains suspicious content');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input and try again.',
      details: errors
    });
  }
  
  // Clean the data
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.message = message.trim();
  
  next();
};

// Validation middleware for login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  
  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  // Validate password
  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input and try again.',
      details: errors
    });
  }
  
  // Clean the data
  req.body.email = email.trim().toLowerCase();
  
  next();
};

// Validation middleware for profile update
const validateProfileUpdate = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];
  
  // Validate name (optional but if provided, must be valid)
  if (name !== undefined) {
    if (name.trim().length === 0) {
      errors.push('Name cannot be empty');
    } else if (name.trim().length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
  }
  
  // Validate email (optional but if provided, must be valid)
  if (email !== undefined) {
    if (email.trim().length === 0) {
      errors.push('Email cannot be empty');
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input and try again.',
      details: errors
    });
  }
  
  // Clean the data
  if (name !== undefined) req.body.name = name.trim();
  if (email !== undefined) req.body.email = email.trim().toLowerCase();
  
  next();
};

// Validation middleware for contact status update
const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['new', 'read', 'replied', 'archived'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      message: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }
  
  next();
};

// Validation middleware for reply
const validateReply = (req, res, next) => {
  const { replyMessage } = req.body;
  
  if (!replyMessage || replyMessage.trim().length === 0) {
    return res.status(400).json({
      error: 'Reply message required',
      message: 'Please provide a reply message'
    });
  }
  
  if (replyMessage.trim().length > 1000) {
    return res.status(400).json({
      error: 'Reply too long',
      message: 'Reply message cannot exceed 1000 characters'
    });
  }
  
  // Clean the data
  req.body.replyMessage = replyMessage.trim();
  
  next();
};

module.exports = {
  validateContact,
  validateLogin,
  validateProfileUpdate,
  validateStatusUpdate,
  validateReply
};

