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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
             {projects.map((project, index) => {
         return (
        <motion.div
          key={project._id}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          className="bg-[#16244a]/80 rounded-xl overflow-hidden shadow-xl border border-blue-400/20 backdrop-blur-lg group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 w-full max-w-sm mx-auto"
        >
          <div className="relative overflow-hidden aspect-video">
                         <Image
               src={getImageUrl(project.image)}
               alt={project.title}
               width={600}
               height={300}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               onError={(e) => {
                 console.error('Image failed to load:', {
                   project: project.title,
                   originalSrc: project.image,
                   processedSrc: getImageUrl(project.image),
                   error: e
                 });
                 
                 // Try alternative image URL formats
                 const target = e.target as HTMLImageElement;
                 const originalSrc = project.image;
                 
                 if (originalSrc && !originalSrc.startsWith('http')) {
                   // Try different URL formats
                   const alternativeUrls = [
                     `http://localhost:5000${originalSrc.startsWith('/') ? originalSrc : `/${originalSrc}`}`,
                     `http://localhost:5000/uploads/projects/${originalSrc.replace(/^.*[\\\/]/, '')}`,
                     `http://localhost:5000/uploads/projects/${originalSrc}`
                   ];
                   
                   console.log('Trying alternative URLs:', alternativeUrls);
                   
                   // Try the first alternative URL
                   if (alternativeUrls[0] !== target.src) {
                     target.src = alternativeUrls[0];
                     return;
                   }
                 }
                 
                 // If all alternatives fail, use placeholder
                 target.src = getPlaceholderUrl(project.title);
               }}
               onLoad={() => {
                 console.log('Image loaded successfully:', {
                   project: project.title,
                   src: getImageUrl(project.image)
                 });
               }}
               priority={index < 2} // Prioritize first 2 images for better performance
             />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <motion.div
            className="bg-[#1e2a4a]/80 p-3 sm:p-4 rounded-b-xl"
            variants={cardContentVariants}
            initial="initial"
            whileHover="hover"
          >
            <motion.h3 
              className="font-bold text-white text-sm sm:text-base mb-2 group-hover:text-cyan-400 transition-colors duration-300" 
              variants={cardContentVariants}
            >
              {project.title}
            </motion.h3>
            
            <motion.p 
              className="text-gray-100 text-xs sm:text-sm mb-3 leading-relaxed" 
              variants={cardContentVariants}
            >
              {project.shortDescription}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-1 mb-3" 
              variants={cardContentVariants}
            >
              {project.technologies.slice(0, 4).map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="bg-[#223366] text-cyan-400 text-[8px] sm:text-[10px] rounded px-1 sm:px-2 py-[1px] sm:py-[2px]"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="bg-[#223366] text-gray-400 text-[8px] sm:text-[10px] rounded px-1 sm:px-2 py-[2px]">
                  +{project.technologies.length - 4}
                </span>
              )}
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-xs" 
              variants={cardContentVariants}
            >
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
            
            {/* Featured badge */}
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
                                                                                        </motion.div>
            </motion.div>
          );
        })}
       </div>
     );
   }

