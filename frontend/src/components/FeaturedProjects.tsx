'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getImageUrl, getPlaceholderUrl } from '@/utils/imageUtils';
import ProjectSkeleton from './ProjectSkeleton';

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

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const cardContentVariants = {
  initial: { opacity: 0, y: 10 },
  hover: { opacity: 1, y: 0 }
};

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects/featured');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      } else {
        console.error('Failed to fetch featured projects');
      }
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProjectSkeleton count={3} />;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🚀</div>
        <p className="text-gray-400 text-lg">No featured projects yet</p>
        <p className="text-gray-500 text-sm mt-2">Projects will appear here once they're added to the admin panel</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          className="bg-[#16244a]/80 rounded-xl overflow-hidden shadow-xl border border-blue-400/20 backdrop-blur-lg group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          <div className="relative overflow-hidden">
            <Image
              src={getImageUrl(project.image)}
              alt={project.title}
              width={600}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getPlaceholderUrl(project.title);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <motion.div
            className="bg-[#1e2a4a]/80 p-4 rounded-b-xl"
            variants={cardContentVariants}
            initial="initial"
            whileHover="hover"
          >
            <motion.h3 
              className="font-bold text-white text-lg mb-2 group-hover:text-cyan-400 transition-colors duration-300" 
              variants={cardContentVariants}
            >
              {project.title}
            </motion.h3>
            
            <motion.p 
              className="text-gray-100 text-sm mb-3 leading-relaxed" 
              variants={cardContentVariants}
            >
              {project.shortDescription}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-2 mb-3" 
              variants={cardContentVariants}
            >
              {project.technologies.slice(0, 4).map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="bg-[#223366] text-cyan-400 text-xs rounded-full px-2 py-1"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="bg-[#223366] text-gray-400 text-xs rounded-full px-2 py-1">
                  +{project.technologies.length - 4}
                </span>
              )}
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between text-sm" 
              variants={cardContentVariants}
            >
              <a 
                href={project.liveDemo !== '#' ? project.liveDemo : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 transition-all duration-300 ${
                  project.liveDemo !== '#' 
                    ? 'text-blue-400 hover:text-blue-300 hover:underline' 
                    : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>🌐</span>
                <span>Live Demo</span>
              </a>
              
              <a 
                href={project.github !== '#' ? project.github : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 transition-all duration-300 ${
                  project.github !== '#' 
                    ? 'text-gray-400 hover:text-gray-300 hover:underline' 
                    : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>📁</span>
                <span>GitHub</span>
              </a>
            </motion.div>
                                           </motion.div>
          </motion.div>
        ))}
      </div>
    );
  }

