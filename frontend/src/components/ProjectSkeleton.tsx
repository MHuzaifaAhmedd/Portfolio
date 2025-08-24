'use client';

import { motion } from 'framer-motion';

interface ProjectSkeletonProps {
  count?: number;
}

export default function ProjectSkeleton({ count = 6 }: ProjectSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {skeletons.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#1a2332]/80 rounded-xl overflow-hidden shadow-xl border border-[#2a3342]/50"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gradient-to-r from-[#2a3342] to-[#3a4352] animate-pulse" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className="h-6 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded animate-pulse" />
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded w-3/4 animate-pulse" />
            </div>
            
            {/* Technologies skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded-full animate-pulse" />
              <div className="h-6 w-14 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded-full animate-pulse" />
            </div>
            
            {/* Links skeleton */}
            <div className="flex justify-between pt-2">
              <div className="h-4 w-20 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded animate-pulse" />
              <div className="h-4 w-16 bg-gradient-to-r from-[#2a3342] to-[#3a4352] rounded animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
