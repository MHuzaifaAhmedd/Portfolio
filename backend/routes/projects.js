const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/projects/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Public routes - Get all published projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// Public routes - Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const featuredProjects = await Project.find({ 
      status: 'published', 
      featured: true 
    })
    .sort({ order: 1, createdAt: -1 })
    .limit(3);
    

    
    res.json({
      success: true,
      data: featuredProjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured projects',
      error: error.message
    });
  }
});

// Public routes - Get projects by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const projects = await Project.find({ 
      status: 'published', 
      category: category 
    })
    .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects by category',
      error: error.message
    });
  }
});

// Admin routes - Get all projects (with auth)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// Admin routes - Create new project
router.post('/admin/create', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      technologies,
      category,
      liveDemo,
      github,
      featured,
      status,
      order,
      difficulty,
      completionDate
    } = req.body;

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/projects/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image; // For external URLs
    } else {
      return res.status(400).json({
        success: false,
        message: 'Project image is required'
      });
    }

    // Parse technologies array
    let techArray = [];
    try {
      if (technologies) {
        techArray = JSON.parse(technologies);
        if (!Array.isArray(techArray)) {
          techArray = [];
        }
      }
    } catch (error) {
      console.log('Failed to parse technologies, using empty array');
      techArray = [];
    }

    const project = new Project({
      title,
      description,
      shortDescription,
      image: imageUrl,
      technologies: techArray,
      category,
      liveDemo: liveDemo || '#',
      github: github || '#',
      featured: featured === 'true',
      status: status || 'published',
      order: order || 0,
      difficulty: difficulty || 'Intermediate',
      completionDate: completionDate ? new Date(completionDate) : null
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// Admin routes - Update project
router.put('/admin/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      updateData.image = `/uploads/projects/${req.file.filename}`;
    }

    // Parse technologies array if it exists
    if (updateData.technologies) {
      updateData.technologies = JSON.parse(updateData.technologies);
    }

    // Parse boolean fields
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true';
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// Admin routes - Delete project
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// Admin routes - Update project status
router.patch('/admin/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project status updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project status',
      error: error.message
    });
  }
});

// Admin routes - Update project order
router.patch('/admin/:id/order', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { order },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project order updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project order',
      error: error.message
    });
  }
});

module.exports = router;
