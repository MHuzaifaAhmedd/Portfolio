'use client';

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { MouseEvent } from "react";
import FeaturedProjects from '../components/FeaturedProjects';

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

export default function Home() {
  // Create hook instances for each card
  const [card1Ref, card1Motion, card1Controls] = useCardTilt();
  const [card2Ref, card2Motion, card2Controls] = useCardTilt();
  const [card3Ref, card3Motion, card3Controls] = useCardTilt();

  // Force re-render when component mounts to fix navigation issues
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // This ensures animations trigger properly when navigating from other pages
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ''
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          success: true,
          message: 'Thank you for your message! I will get back to you soon.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          projectType: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          success: false,
          message: result.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main key="home-page" className="relative min-h-screen font-sans overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f]">
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
        <a
          href="#"
          className="font-semibold text-cyan-400 text-lg sm:text-xl md:text-2xl tracking-tight hover:scale-105 transition-transform duration-200 self-start sm:self-auto"
        >
          huzaifa.<span className="text-cyan-400">dev</span>
        </a>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden self-end sm:self-auto w-10 h-10 bg-[#1a2332]/80 rounded-lg flex items-center justify-center border border-[#2a3342]/50 hover:border-cyan-400/50 transition-all duration-300">
          <i className="fas fa-bars text-cyan-400"></i>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 text-xs font-semibold text-gray-300">
          <a className="hover:text-white transition relative group" href="#">
            <span className="group-hover:underline group-hover:underline-offset-4">HOME</span>
          </a>
          <a className="hover:text-white transition relative group" href="/projects">
            <span className="group-hover:underline group-hover:underline-offset-4">PROJECTS</span>
          </a>
          <a className="hover:text-white transition relative group" href="#">
            <span className="group-hover:underline group-hover:underline-offset-4">ABOUT</span>
          </a>
          <a className="hover:text-white transition relative group" href="#">
            <span className="group-hover:underline group-hover:underline-offset-4">CONTACT</span>
          </a>
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

      {/* Responsive Hero Section */}
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={sectionVariant}
        className="text-center pt-8 sm:pt-10 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto relative z-20"
      >
        <motion.div variants={sectionVariant}>
          <span className="inline-block text-[10px] sm:text-xs font-semibold text-cyan-400 border border-cyan-400 rounded-full px-2 sm:px-3 py-[2px] mb-3 sm:mb-4 bg-[#0a0f1f]/60 backdrop-blur">
            SOFTWARE ENGINEER
          </span>
        </motion.div>
        <motion.h1
          variants={sectionVariant}
          className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight max-w-3xl mx-auto text-white px-2 sm:px-4"
        >
          Building <span className="text-cyan-300 font-bold">AI-powered</span> <span className="text-blue-300 font-bold">solutions</span> that <br className="hidden sm:block" /> transform industries.
        </motion.h1>
        <motion.p
          variants={sectionVariant}
          className="text-gray-200 text-sm sm:text-base font-medium mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed px-4 sm:px-6"
        >
          Full-stack developer specializing in React, Django, AI integration, and mobile applications. 
          Creating intelligent systems that solve real-world problems.
        </motion.p>
        <motion.div
          variants={sectionVariant}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 px-4 sm:px-6"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto bg-cyan-400 text-black text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-3 rounded hover:bg-cyan-500 transition flex items-center justify-center space-x-1 shadow-lg shadow-cyan-400/10"
          >
            <span>Let&apos;s Talk</span>
            <i className="fas fa-arrow-right"></i>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto bg-transparent border border-gray-600 text-gray-300 text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-3 rounded hover:bg-gray-800 transition flex items-center justify-center space-x-2 shadow-lg shadow-gray-600/10"
          >
            <i className="fas fa-download"></i>
            <span>Download Resume</span>
          </motion.button>
        </motion.div>
        <motion.div
          variants={sectionVariant}
          className="mt-8 sm:mt-10 text-gray-600 text-lg sm:text-xl animate-bounce"
        >
          <i className="fas fa-chevron-down"></i>
        </motion.div>
      </motion.div>

      {/* Responsive About Section */}
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={sectionVariant}
        className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between max-w-7xl mx-auto gap-8 sm:gap-10 md:gap-16 lg:gap-20 px-4 sm:px-6 md:px-10 lg:px-16 relative z-20"
      >
        <motion.div variants={sectionVariant} className="max-w-xl text-left order-2 lg:order-1">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 text-white">About Me</h2>
          <p className="text-gray-100 text-sm sm:text-base font-medium mb-4 sm:mb-6 leading-relaxed">
            I&apos;m Muhammad Huzaifa Ahmed, a Software Engineer with expertise in full-stack development, AI integration, and mobile applications. 
            Currently working at Family Builders & Developers, building scalable business applications with automated workflows and real-time data processing.
          </p>
          <p className="text-gray-100 text-sm sm:text-base font-medium mb-6 sm:mb-8 leading-relaxed">
            My experience includes developing AI-powered road safety systems using YOLOv8, comprehensive HR management platforms, and e-commerce solutions. 
            I specialize in React, Django, React Native, and database technologies including Oracle, MySQL, and MongoDB.
          </p>
          <ul className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 text-gray-100 text-sm sm:text-base font-medium">
            <li className="flex items-center space-x-2 sm:space-x-3">
              <span className="block w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/30"></span>
              <span>Based in Karachi, Pakistan</span>
            </li>
            <li className="flex items-center space-x-2 sm:space-x-3">
              <span className="block w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/30"></span>
              <span>Available for freelance</span>
            </li>
            <li className="flex items-center space-x-2 sm:space-x-3">
              <span className="block w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/30"></span>
              <span>Open to relocation</span>
            </li>
          </ul>
        </motion.div>
        <motion.div
          variants={sectionVariant}
          className="relative max-w-xs sm:max-w-sm w-full rounded-lg overflow-hidden shadow-2xl shadow-cyan-400/10 backdrop-blur-lg bg-[#0a0f1f]/60 order-1 lg:order-2 mb-6 lg:mb-0"
        >
          <Image
            src="https://storage.googleapis.com/a1aa/image/ec171ba0-988b-4d60-7008-5bad5bd99d49.jpg"
            alt="Portrait"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg object-cover"
          />
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-[#111111cc] rounded-lg p-2 sm:p-4 w-32 sm:w-44 text-left backdrop-blur shadow-lg shadow-cyan-400/10">
            <h3 className="text-cyan-400 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Tech Stack</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-gray-300 text-[8px] sm:text-[9px]">
              <div className="flex flex-col items-center space-y-1">
                <i className="fab fa-react text-cyan-400 text-sm sm:text-lg"></i>
                <span>React</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <i className="fab fa-python text-cyan-400 text-sm sm:text-lg"></i>
                <span>Django</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <i className="fab fa-mobile text-cyan-400 text-sm sm:text-lg"></i>
                <span>React Native</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <i className="fab fa-node-js text-cyan-400 text-sm sm:text-lg"></i>
                <span>Express.js</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <i className="fas fa-database text-cyan-400 text-sm sm:text-lg"></i>
                <span>MongoDB</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <i className="fas fa-brain text-cyan-400 text-sm sm:text-lg"></i>
                <span>AI/ML</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Responsive Featured Work & Testimonials Section --- */}
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20 relative z-20"
      >
        {/* Featured Work Section */}
        <motion.div variants={sectionVariant}>
          <h2 className="font-bold text-white text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 lg:mb-10 text-center px-4 sm:px-6">Featured Work</h2>
          <div className="px-4 sm:px-6">
            <FeaturedProjects />
          </div>
          <div className="mt-8 text-center">
            <a className="text-cyan-400 text-xs flex items-center justify-center gap-1 hover:underline" href="/projects">
              View All Projects
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </motion.div>

      </motion.div>

      {/* --- Contact Section --- */}
      {/* Unified Contact & Footer Section - World Class Design */}
      <motion.section
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={sectionVariant}
        className="relative bg-gradient-to-b from-[#1a2332]/80 via-[#0f1a2a]/90 to-[#0a0f1f]/95 overflow-hidden backdrop-blur-sm border-t border-[#2a3342]/50"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #00fff7 0.5px, transparent 0.5px),
                             radial-gradient(circle at 80% 80%, #00fff7 0.5px, transparent 0.5px)`,
            backgroundSize: '120px 120px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          {/* Responsive Elegant Header */}
          <motion.div 
            variants={sectionVariant}
            className="text-center mb-12 sm:mb-16 lg:mb-20 px-4 sm:px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-xs sm:text-sm font-medium">Ready to Collaborate</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-2 sm:px-4">
              Let&apos;s Create
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                Something Amazing
              </span>
            </h2>
            <p className="text-gray-100 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium px-4 sm:px-6">
              Transform your ideas into reality with cutting-edge technology and innovative solutions. 
              Available for freelance projects and full-time opportunities.
            </p>
          </motion.div>

          {/* Responsive Contact Form & Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
            
            {/* Contact Form - Takes 2 columns on large screens */}
            <motion.div variants={sectionVariant} className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-cyan-400/10">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <i className="fas fa-paper-plane text-black text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Start a Project</h3>
                      <p className="text-gray-100 font-medium">Let&apos;s discuss your vision</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-100">Full Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#0a0f1f]/80 border border-[#2a3342] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-100">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#0a0f1f]/80 border border-[#2a3342] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="projectType" className="text-xs sm:text-sm font-semibold text-gray-100">Project Type</label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0a0f1f]/80 border border-[#2a3342] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                      >
                        <option value="">Select a project type</option>
                        <option value="web-development">Web Development</option>
                        <option value="mobile-app">Mobile App</option>
                        <option value="ai-ml">AI/ML Solutions</option>
                        <option value="consulting">Consulting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs sm:text-sm font-semibold text-gray-100">Project Details</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#0a0f1f]/80 border border-[#2a3342] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 resize-none text-sm sm:text-base"
                        placeholder="Tell me about your project, timeline, and requirements..."
                      ></textarea>
                    </div>

                    {/* Success/Error Messages */}
                    {submitStatus.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl ${
                          submitStatus.success 
                            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                            : 'bg-red-500/20 border border-red-500/30 text-red-400'
                        }`}
                      >
                        {submitStatus.message}
                      </motion.div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center space-x-2">
                            <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </span>
                        ) : (
                          'Send Message'
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="flex items-center justify-center space-x-2 bg-[#1a2332] hover:bg-[#2a3342] border border-[#2a3342] hover:border-cyan-400/50 text-gray-300 hover:text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
                      >
                        <i className="fas fa-calendar-alt text-sm"></i>
                        <span>Schedule Call</span>
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Contact Info - Takes 1 column */}
            <motion.div variants={sectionVariant} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Get in Touch
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Ready to start your next project? Let&apos;s connect and bring your vision to life.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="group p-4 rounded-xl bg-gradient-to-r from-[#1a2332]/60 to-[#0f1a2a]/60 border border-[#2a3342]/50 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-envelope text-cyan-400 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <a href="mailto:Ahmedhuzaifa451@gmail.com" className="text-white font-medium hover:text-cyan-400 transition-colors duration-300">
                        Ahmedhuzaifa451@gmail.com
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="group p-4 rounded-xl bg-gradient-to-r from-[#1a2332]/60 to-[#0f1a2a]/60 border border-[#2a3342]/50 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-map-marker-alt text-cyan-400 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-medium">San Francisco, CA</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="group p-4 rounded-xl bg-gradient-to-r from-[#1a2332]/60 to-[#0f1a2a]/60 border border-[#2a3342]/50 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-clock text-cyan-400 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Response</p>
                      <p className="text-white font-medium">Within 24 hours</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="pt-6">
                <p className="text-gray-400 text-sm font-medium mb-4">Connect with me</p>
                <div className="flex space-x-3">
                  {[
                    { name: 'LinkedIn', icon: 'linkedin-in', color: 'hover:text-blue-400' },
                    { name: 'GitHub', icon: 'github', color: 'hover:text-gray-300' },
                    { name: 'Twitter', icon: 'twitter', color: 'hover:text-blue-400' },
                    { name: 'Dribbble', icon: 'dribbble', color: 'hover:text-pink-400' }
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 bg-[#1a2332]/60 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} border border-[#2a3342]/50 hover:border-cyan-400/30`}
                    >
                      <i className={`fab fa-${social.icon} text-sm`}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Footer with Hover Visualizations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative border-t border-[#2a3342]/50 bg-gradient-to-b from-[#1a2332]/80 to-[#0a0f1f]/95 overflow-hidden backdrop-blur-sm"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ 
                scale: [1.1, 1, 1.1],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-2xl"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              
              {/* Enhanced Brand Section */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="sm:col-span-2 space-y-4 sm:space-y-6 group"
              >
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <motion.div 
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      boxShadow: "0 0 30px rgba(0, 255, 247, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center transition-all duration-300"
                  >
                    <span className="text-black font-bold text-xl">H</span>
                  </motion.div>
                  <div>
                    <motion.h3 
                      whileHover={{ color: "#00fff7" }}
                      className="text-white font-bold text-xl transition-colors duration-300"
                    >
                      Muhammad Huzaifa Ahmed
                    </motion.h3>
                    <motion.p 
                      animate={{ 
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-cyan-400 text-sm font-medium"
                    >
                      Software Engineer
                    </motion.p>
                  </div>
                </motion.div>
                <motion.p 
                  whileHover={{ color: "#e5e7eb" }}
                  className="text-gray-400 text-sm leading-relaxed max-w-md transition-colors duration-300 group-hover:text-gray-300"
                >
                  Software Engineer with expertise in full-stack development, AI integration, and mobile applications. 
                  Currently working at Family Builders & Developers, building scalable business applications with 
                  automated workflows and real-time data processing.
                </motion.p>
              </motion.div>

              {/* Enhanced Quick Links */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <motion.h4 
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: "0 0 10px rgba(0, 255, 247, 0.5)"
                  }}
                  className="text-white font-semibold text-base transition-all duration-300"
                >
                  Quick Links
                </motion.h4>
                <ul className="space-y-3">
                  {['Home', 'Projects', 'About', 'Contact'].map((link, index) => (
                    <motion.li 
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <motion.a
                        href={link === 'Home' ? '/' : link === 'Projects' ? '/projects' : '#'}
                        whileHover={{ 
                          x: 8,
                          scale: 1.05
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm flex items-center group relative overflow-hidden"
                      >
                        <motion.span 
                          className="w-1 h-1 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ 
                            scale: [1, 1.5, 1],
                            boxShadow: "0 0 10px rgba(0, 255, 247, 0.8)"
                          }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative">
                          {link}
                          <motion.div
                            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-blue-500"
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </span>
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Enhanced Contact Info */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <motion.h4 
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: "0 0 10px rgba(0, 255, 247, 0.5)"
                  }}
                  className="text-white font-semibold text-base transition-all duration-300"
                >
                  Get In Touch
                </motion.h4>
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ 
                      x: 5,
                      scale: 1.02
                    }}
                    className="flex items-start space-x-3 group cursor-pointer"
                  >
                    <motion.div 
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 10,
                        backgroundColor: "#1a2332",
                        boxShadow: "0 0 20px rgba(0, 255, 247, 0.3)"
                      }}
                      className="w-8 h-8 bg-[#1a2332] rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300"
                    >
                      <motion.i 
                        whileHover={{ scale: 1.2 }}
                        className="fas fa-envelope text-cyan-400 text-xs"
                      />
                    </motion.div>
                    <div>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Email</p>
                      <motion.a 
                        href="mailto:Ahmedhuzaifa451@gmail.com" 
                        whileHover={{ 
                          color: "#00fff7",
                          textShadow: "0 0 5px rgba(0, 255, 247, 0.5)"
                        }}
                        className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 text-sm relative"
                      >
                        Ahmedhuzaifa451@gmail.com
                        <motion.div
                          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-blue-500"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.a>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ 
                      x: 5,
                      scale: 1.02
                    }}
                    className="flex items-start space-x-3 group cursor-pointer"
                  >
                    <motion.div 
                      whileHover={{ 
                        scale: 1.2,
                        rotate: -10,
                        backgroundColor: "#1a2332",
                        boxShadow: "0 0 20px rgba(0, 255, 247, 0.3)"
                      }}
                      className="w-8 h-8 bg-[#1a2332] rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300"
                    >
                      <motion.i 
                        whileHover={{ scale: 1.2 }}
                        className="fas fa-map-marker-alt text-cyan-400 text-xs"
                      />
                    </motion.div>
                    <div>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Location</p>
                      <motion.p 
                        whileHover={{ 
                          color: "#00fff7",
                          textShadow: "0 0 5px rgba(0, 255, 247, 0.5)"
                        }}
                        className="text-cyan-400 text-sm transition-all duration-300"
                      >
                        Karachi, Pakistan
                      </motion.p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Footer Bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border-t border-[#2a3342]/50 pt-8 mt-12 relative"
            >
              {/* Subtle glow line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm"
                >
                  <motion.span 
                    whileHover={{ 
                      color: "#e5e7eb",
                      textShadow: "0 0 5px rgba(255, 255, 255, 0.3)"
                    }}
                    className="text-gray-500 transition-all duration-300 text-center sm:text-left"
                  >
                    © 2024 Muhammad Huzaifa Ahmed. All rights reserved.
                  </motion.span>
                  <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500">
                    <motion.a 
                      href="#" 
                      whileHover={{ 
                        color: "#00fff7",
                        scale: 1.05,
                        textShadow: "0 0 5px rgba(0, 255, 247, 0.5)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:text-cyan-400 transition-all duration-300 relative text-xs sm:text-sm"
                    >
                      Privacy Policy
                      <motion.div
                        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-blue-500"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                    <motion.span
                      animate={{ 
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      •
                    </motion.span>
                    <motion.a 
                      href="#" 
                      whileHover={{ 
                        color: "#00fff7",
                        scale: 1.05,
                        textShadow: "0 0 5px rgba(0, 255, 247, 0.5)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:text-cyan-400 transition-all duration-300 relative text-xs sm:text-sm"
                    >
                      Terms of Service
                      <motion.div
                        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-blue-500"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  </div>
                </motion.div>
                
                {/* Enhanced Back to Top Button */}
                <motion.button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -3,
                    boxShadow: "0 10px 30px rgba(0, 255, 247, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-[#1a2332] to-[#2a3342] hover:from-[#2a3342] hover:to-[#3a4352] border border-[#2a3342] hover:border-cyan-400/50 rounded-lg px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden"
                >
                  {/* Button glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  <motion.span 
                    whileHover={{ color: "#ffffff" }}
                    className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm font-medium relative z-10"
                  >
                    Back to Top
                  </motion.span>
                  
                  <motion.i 
                    className="fas fa-arrow-up text-cyan-400 text-sm relative z-10"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, 5, -5, 0],
                      textShadow: "0 0 10px rgba(0, 255, 247, 0.8)"
                    }}
                  />
                  
                  {/* Ripple effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    whileHover={{
                      background: [
                        "radial-gradient(circle at center, rgba(0, 255, 247, 0) 0%, rgba(0, 255, 247, 0) 100%)",
                        "radial-gradient(circle at center, rgba(0, 255, 247, 0.1) 0%, rgba(0, 255, 247, 0) 70%)",
                        "radial-gradient(circle at center, rgba(0, 255, 247, 0) 0%, rgba(0, 255, 247, 0) 100%)"
                      ]
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </div>
            </motion.div>
    </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
