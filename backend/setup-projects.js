const mongoose = require('mongoose');
const Project = require('./models/Project');
require('dotenv').config();

const initialProjects = [
  {
    title: "RastaNigheban.ai",
    description: "AI-based road safety system using YOLOv8 for real-time pothole detection with React Native and Django. This innovative solution helps municipalities identify and prioritize road maintenance by automatically detecting potholes and road damage from vehicle-mounted cameras.",
    shortDescription: "AI-based road safety system using YOLOv8 for real-time pothole detection with React Native and Django.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&crop=center",
    technologies: ["React Native", "Django", "YOLOv8", "AI/ML", "Python", "TensorFlow"],
    category: "AI/ML",
    liveDemo: "#",
    github: "#",
    featured: true,
    status: "published",
    order: 1
  },
  {
    title: "HR Management System",
    description: "Comprehensive HR platform with candidate management, interview scheduling & automated coding assessments. Features include applicant tracking, skill evaluation, automated interview scheduling, and performance analytics.",
    shortDescription: "Comprehensive HR platform with candidate management, interview scheduling & automated coding assessments.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&crop=center",
    technologies: ["React/Next.js", "Node.js", "MongoDB", "Docker", "Express", "JWT"],
    category: "Web Application",
    liveDemo: "#",
    github: "#",
    featured: true,
    status: "published",
    order: 2
  },
  {
    title: "Naba Hussam E-commerce",
    description: "Complete e-commerce solution with Admin panel, user authentication, product management, and order processing. Built with modern web technologies and includes features like real-time inventory tracking and payment processing.",
    shortDescription: "Complete e-commerce solution with Admin panel, user authentication, product management, and order processing.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop&crop=center",
    technologies: ["React.js", "Node.js", "MongoDB", "Docker", "Stripe", "Redux"],
    category: "E-commerce",
    liveDemo: "#",
    github: "#",
    featured: true,
    status: "published",
    order: 3
  },
  {
    title: "HealthPulse Analytics",
    description: "Advanced health data analytics platform that processes patient information to provide insights for healthcare providers. Features include predictive analytics, patient risk assessment, and treatment outcome analysis.",
    shortDescription: "Advanced health data analytics platform with predictive analytics and patient risk assessment.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=300&fit=crop&crop=center",
    technologies: ["Python", "Pandas", "Scikit-learn", "Flask", "PostgreSQL", "Docker"],
    category: "Analytics",
    liveDemo: "#",
    github: "#",
    featured: false,
    status: "published",
    order: 4
  },
  {
    title: "Smart Home IoT Hub",
    description: "Centralized IoT management system for smart homes. Controls lighting, temperature, security cameras, and other connected devices through a unified interface with automation and scheduling capabilities.",
    shortDescription: "Centralized IoT management system for smart homes with automation and scheduling capabilities.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&crop=center",
    technologies: ["Node.js", "MQTT", "React Native", "MongoDB", "WebSocket", "Raspberry Pi"],
    category: "IoT",
    liveDemo: "#",
    github: "#",
    featured: false,
    status: "published",
    order: 5
  },
  {
    title: "Mobile Health Tracker",
    description: "Cross-platform mobile application for health and fitness tracking. Includes features like workout logging, nutrition tracking, sleep monitoring, and progress visualization with social sharing capabilities.",
    shortDescription: "Cross-platform mobile application for health and fitness tracking with social sharing capabilities.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop&crop=center",
    technologies: ["React Native", "Firebase", "Redux", "TypeScript", "HealthKit", "Google Fit"],
    category: "Mobile Health",
    liveDemo: "#",
    github: "#",
    featured: false,
    status: "published",
    order: 6
  }
];

async function setupProjects() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Insert initial projects
    const createdProjects = await Project.insertMany(initialProjects);
    console.log(`✅ Created ${createdProjects.length} projects successfully`);

    // Display created projects
    console.log('\n📋 Created Projects:');
    createdProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.category}) - ${project.featured ? '⭐ Featured' : 'Standard'}`);
    });

    console.log('\n🎉 Project setup completed successfully!');
    console.log('💡 You can now access the admin panel to manage these projects');

  } catch (error) {
    console.error('❌ Error setting up projects:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the setup
setupProjects();

