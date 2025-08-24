'use client';

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { getImageUrl, getPlaceholderUrl } from '@/utils/imageUtils';
import ProjectSkeleton from '@/components/ProjectSkeleton';

// Animation variants
const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

function useCardTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const motionProps = {
    onMouseMove: (e: MouseEvent<HTMLDivElement>) => {
      const card = ref.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Subtle tilt: max 12deg
      const rotateY = ((x - centerX) / centerX) * 12;
      const rotateX = -((y - centerY) / centerY) * 12;
      controls.start({
        rotateX,
        rotateY,
        scale: 1.045,
        boxShadow: "0 12px 32px 0 rgba(37,99,235,0.18), 0 0 24px 2px #2563eb44",
        borderColor: "#2563eb",
        transition: { type: "spring", stiffness: 350, damping: 22 }
      });
    },
    onMouseLeave: () => {
      controls.start({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        borderColor: "#3b82f6",
        transition: { type: "spring", stiffness: 200, damping: 24 }
      });
    },
  };
  return [ref, motionProps, controls] as const;
}

const cardContentVariants = {
  initial: { opacity: 0, y: 20 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

const cardStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.13 } },
};

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: string[];
  category: string;
  liveDemo: string;
  github: string;
  featured: boolean;
  status: string;
  order: number;
}

// Default project data (fallback)
const defaultProjects = [
  {
    id: 1,
    title: "RastaNigheban.ai",
    description: "AI-based road safety system using YOLOv8 for real-time pothole detection with React Native and Django.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&crop=center",
    technologies: ["React Native", "Django", "YOLOv8", "AI/ML"],
    category: "AI/ML",
    liveDemo: "#",
    github: "#",
    featured: true
  },
  {
    id: 2,
    title: "HR Management System",
    description: "Comprehensive HR platform with candidate management, interview scheduling & automated coding assessments.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&crop=center",
    technologies: ["React/Next.js", "Node.js", "MongoDB", "Docker"],
    category: "Web Application",
    liveDemo: "#",
    github: "#",
    featured: true
  },
  {
    id: 3,
    title: "Naba Hussam E-commerce",
    description: "Complete e-commerce solution with Admin panel, user authentication, product management, and order processing.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop&crop=center",
    technologies: ["React.js", "Node.js", "MongoDB", "Docker"],
    category: "E-commerce",
    liveDemo: "#",
    github: "#",
    featured: true
  },
  {
    id: 4,
    title: "FinTrack Dashboard",
    description: "Advanced financial analytics dashboard with real-time data visualization and predictive insights.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&crop=center",
    technologies: ["React", "D3.js", "Python", "PostgreSQL"],
    category: "Analytics",
    liveDemo: "#",
    github: "#",
    featured: false
  },
  {
    id: 5,
    title: "HealthPulse Mobile App",
    description: "Health tracking application with wearable integration and personalized wellness recommendations.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop&crop=center",
    technologies: ["React Native", "Firebase", "HealthKit", "TensorFlow"],
    category: "Mobile Health",
    liveDemo: "#",
    github: "#",
    featured: false
  },
  {
    id: 6,
    title: "Smart Home IoT Hub",
    description: "Centralized IoT management system for smart home automation and energy optimization.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&crop=center",
    technologies: ["Python", "MQTT", "React", "Raspberry Pi"],
    category: "IoT",
    liveDemo: "#",
    github: "#",
    featured: false
  }
];

const categories = ["All", "AI/ML", "Web Application", "E-commerce", "Analytics", "Mobile Health", "IoT"];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
        setError(null);
      } else {
        setError('Failed to fetch projects');
        // Use default projects as fallback
        setProjects(defaultProjects.map(p => ({
          _id: p.id.toString(),
          title: p.title,
          description: p.description,
          shortDescription: p.description.substring(0, 150) + '...',
          image: p.image,
          technologies: p.technologies,
          category: p.category,
          liveDemo: p.liveDemo,
          github: p.github,
          featured: p.featured,
          status: 'published',
          order: p.id
        })));
      }
    } catch (error) {
      setError('Network error');
      // Use default projects as fallback
      setProjects(defaultProjects.map(p => ({
        _id: p.id.toString(),
        title: p.title,
        description: p.description,
        shortDescription: p.description.substring(0, 150) + '...',
        image: p.image,
        technologies: p.technologies,
        category: p.category,
        liveDemo: p.liveDemo,
        github: p.github,
        featured: p.featured,
        status: 'published',
        order: p.id
      })));
    } finally {
      setLoading(false);
    }
  };

  // Create hook instances for each card
  const [card1Ref, card1Motion, card1Controls] = useCardTilt();
  const [card2Ref, card2Motion, card2Controls] = useCardTilt();
  const [card3Ref, card3Motion, card3Controls] = useCardTilt();
  const [card4Ref, card4Motion, card4Controls] = useCardTilt();
  const [card5Ref, card5Motion, card5Controls] = useCardTilt();
  const [card6Ref, card6Motion, card6Controls] = useCardTilt();

  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref, card5Ref, card6Ref];
  const cardMotions = [card1Motion, card2Motion, card3Motion, card4Motion, card5Motion, card6Motion];
  const cardControls = [card1Controls, card2Controls, card3Controls, card4Controls, card5Controls, card6Controls];



  // Filter projects based on category and search
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.shortDescription || project.description).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="relative min-h-screen font-sans overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f]">
      {/* Professional Color Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f] -z-10" />
      
      {/* Subtle Background Pattern */}
      <div className="fixed top-0 left-0 w-full h-full opacity-5 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #00fff7 0.5px, transparent 0.5px),
                           radial-gradient(circle at 80% 80%, #00fff7 0.5px, transparent 0.5px)`,
          backgroundSize: '120px 120px'
        }}></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-5 pointer-events-none">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-16 left-16 w-24 h-24 border border-cyan-400/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-32 right-24 w-20 h-20 border border-blue-500/20 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-24 left-24 w-16 h-16 border border-cyan-400/20 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.25, 0.1],
            rotate: [0, 90, 180]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Responsive Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-5 relative z-20 space-y-4 sm:space-y-0"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold text-cyan-400 text-lg sm:text-xl md:text-2xl tracking-tight hover:scale-105 transition-transform duration-200 self-start sm:self-auto"
        >
          huzaifa.<span className="text-cyan-400">dev</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden self-end sm:self-auto w-10 h-10 bg-[#1a2332]/80 rounded-lg flex items-center justify-center border border-[#2a3342]/50 hover:border-cyan-400/50 transition-all duration-300">
          <i className="fas fa-bars text-cyan-400"></i>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 text-xs font-semibold text-gray-300">
          <Link className="hover:text-white transition relative group" href="/">
            <span className="group-hover:underline group-hover:underline-offset-4">HOME</span>
          </Link>
          <Link className="hover:text-white transition relative group text-cyan-400" href="/projects">
            <span className="group-hover:underline group-hover:underline-offset-4">PROJECTS</span>
          </Link>
          <Link className="hover:text-white transition relative group" href="#">
            <span className="group-hover:underline group-hover:underline-offset-4">ABOUT</span>
          </Link>
          <Link className="hover:text-white transition relative group" href="#">
            <span className="group-hover:underline group-hover:underline-offset-4">CONTACT</span>
          </Link>
        </nav>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          <motion.button
            whileHover={{ scale: 1.15, rotate: -10 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle dark mode"
            className="text-gray-300 hover:text-white transition text-lg"
          >
            <i className="fas fa-moon"></i>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="text-cyan-400 border border-cyan-400 text-xs font-semibold px-3 lg:px-4 py-1 rounded hover:bg-cyan-400 hover:text-black transition shadow-lg shadow-cyan-400/10"
          >
            LET&apos;S TALK
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={sectionVariant}
        className="text-center pt-8 sm:pt-10 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto relative z-20"
      >
        <motion.div variants={sectionVariant}>
          <span className="inline-block text-[10px] sm:text-xs font-semibold text-cyan-400 border border-cyan-400 rounded-full px-2 sm:px-3 py-[2px] mb-3 sm:mb-4 bg-[#0a0f1f]/60 backdrop-blur">
            PORTFOLIO SHOWCASE
          </span>
        </motion.div>
        <motion.h1
          variants={sectionVariant}
          className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight max-w-3xl mx-auto text-white px-2 sm:px-4"
        >
          My <span className="text-cyan-300 font-bold">Projects</span> & <span className="text-blue-300 font-bold">Work</span>
        </motion.h1>
        <motion.p
          variants={sectionVariant}
          className="text-gray-200 text-sm sm:text-base font-medium mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed px-4 sm:px-6"
        >
          Explore my latest work and innovative solutions across various technologies and domains.
        </motion.p>
      </motion.div>

      {/* Filters and Search Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 mt-8 sm:mt-12 relative z-20"
      >
        <div className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Filter Projects</h2>
              <p className="text-gray-400 text-sm">Find the perfect project for your needs</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 lg:w-64 bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20 relative z-20"
      >
        {/* Loading State */}
        {loading && <ProjectSkeleton count={6} />}

        {/* Error State */}
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-400 text-lg mb-2">Error loading projects</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button 
              onClick={fetchProjects}
              className="mt-4 bg-cyan-400 text-black px-6 py-2 rounded-xl hover:bg-cyan-500 transition-all duration-300"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6"
            variants={cardStagger}
            initial="initial"
            animate="animate"
          >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              ref={cardRefs[index]}
              {...cardMotions[index]}
              animate={cardControls[index]}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-[#16244a]/80 rounded-xl overflow-hidden shadow-xl w-full max-w-sm mx-auto border border-blue-400/20 backdrop-blur-lg group transition-all duration-300"
              style={{ willChange: "transform" }}
            >
                             <Image
                 alt={`Screenshot of ${project.title}`}
                 className="w-full object-cover"
                 height={300}
                 src={getImageUrl(project.image)}
                 width={600}
                 onError={(e) => {
                   // Fallback to a placeholder if image fails to load
                   const target = e.target as HTMLImageElement;
                   target.src = getPlaceholderUrl(project.title);
                 }}
               />
              <motion.div
                className="bg-[#1e2a4a]/80 p-3 sm:p-4 rounded-b-xl"
                variants={cardContentVariants}
                initial="initial"
                whileHover="hover"
              >
                <motion.h3 className="font-bold text-white text-sm sm:text-base mb-2" variants={cardContentVariants}>
                  {project.title}
                </motion.h3>
                <motion.p className="text-gray-100 text-xs sm:text-sm mb-3 leading-relaxed" variants={cardContentVariants}>
                  {project.shortDescription || project.description?.substring(0, 150) + '...'}
                </motion.p>
                <motion.div className="flex flex-wrap gap-1 mb-3" variants={cardContentVariants}>
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-[#223366] text-[8px] sm:text-[10px] rounded px-1 sm:px-2 py-[1px] sm:py-[2px]">
                      {tech}
                    </span>
                  ))}
                </motion.div>
                <motion.div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-xs" variants={cardContentVariants}>
                  <span className="text-blue-400 flex items-center justify-center sm:justify-start gap-1">
                    <a className="hover:underline hover:border-b-2 hover:border-blue-400 transition-all duration-200" href={project.liveDemo}>
                      Live Demo
                    </a>
                  </span>
                  <span className="text-gray-400 flex items-center justify-center sm:justify-start gap-1">
                    <a className="hover:underline hover:border-b-2 hover:border-blue-400 transition-all duration-200" href={project.github}>
                      GitHub
                    </a>
                  </span>
                </motion.div>
                {project.featured && (
                  <motion.div 
                    className="mt-3 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-400 to-blue-500 text-black">
                      ⭐ Featured Project
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        )}
        
        {!loading && !error && filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">No projects found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </motion.div>

      {/* Back to Home Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
        className="text-center pb-16 relative z-20"
      >
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold px-8 py-3 rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-400/25"
          >
            <span className="flex items-center justify-center space-x-2">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Home</span>
            </span>
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}
