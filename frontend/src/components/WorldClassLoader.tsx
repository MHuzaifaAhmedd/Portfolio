'use client';

import { motion } from 'framer-motion';

interface WorldClassLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pulse' | 'wave' | 'orbit';
}

export default function WorldClassLoader({ 
  message = "Loading...", 
  size = 'md',
  variant = 'default'
}: WorldClassLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className="relative">
            {/* Outer pulse rings */}
            <motion.div
              className={`${sizeClasses[size]} border-2 border-cyan-400/30 rounded-full absolute inset-0`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={`${sizeClasses[size]} border-2 border-cyan-400/20 rounded-full absolute inset-0`}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.05, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            {/* Center core */}
            <motion.div
              className={`${sizeClasses[size]} bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="w-1/3 h-1/3 bg-white rounded-full"
                animate={{
                  scale: [1, 0.8, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        );

      case 'wave':
        return (
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-8 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full"
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        );

      case 'orbit':
        return (
          <div className="relative">
            {/* Orbiting dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-6px',
                  marginTop: '-6px'
                }}
                animate={{
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.25
                }}
              />
            ))}
            
            {/* Center sphere */}
            <motion.div
              className={`${sizeClasses[size]} bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center`}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div
                className="w-1/4 h-1/4 bg-white/20 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        );

      default:
        return (
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className={`${sizeClasses[size]} border-4 border-cyan-400/20 rounded-full`}
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Middle ring */}
            <motion.div
              className={`${sizeClasses[size]} border-4 border-transparent border-t-cyan-400 rounded-full absolute inset-0`}
              animate={{
                rotate: [0, -360]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Inner ring */}
            <motion.div
              className={`${sizeClasses[size]} border-4 border-transparent border-b-blue-500 rounded-full absolute inset-0`}
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Center dot */}
            <motion.div
              className={`${sizeClasses[size]} bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center absolute inset-0`}
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="w-1/3 h-1/3 bg-white rounded-full"
                animate={{
                  scale: [1, 0.8, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        );
    }
  };

  // Pre-calculate particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: 5, top: 15, duration: 3, delay: 0 },
    { left: 15, top: 25, duration: 3.5, delay: 0.5 },
    { left: 25, top: 35, duration: 4, delay: 1 },
    { left: 35, top: 45, duration: 3, delay: 1.5 },
    { left: 45, top: 55, duration: 3.5, delay: 0 },
    { left: 55, top: 65, duration: 4, delay: 0.5 },
    { left: 65, top: 75, duration: 3, delay: 1 },
    { left: 75, top: 85, duration: 3.5, delay: 1.5 },
    { left: 85, top: 95, duration: 4, delay: 0 },
    { left: 95, top: 5, duration: 3, delay: 0.5 },
    { left: 10, top: 20, duration: 3.5, delay: 1 },
    { left: 20, top: 30, duration: 4, delay: 1.5 },
    { left: 30, top: 40, duration: 3, delay: 0 },
    { left: 40, top: 50, duration: 3.5, delay: 0.5 },
    { left: 50, top: 60, duration: 4, delay: 1 },
    { left: 60, top: 70, duration: 3, delay: 1.5 },
    { left: 70, top: 80, duration: 3.5, delay: 0 },
    { left: 80, top: 90, duration: 4, delay: 0.5 },
    { left: 90, top: 10, duration: 3, delay: 1 },
    { left: 0, top: 25, duration: 3.5, delay: 1.5 }
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f] flex items-center justify-center relative overflow-hidden"
      suppressHydrationWarning={true}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particlePositions.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay
            }}
          />
        ))}
      </div>

      {/* Main loader content */}
      <div className="text-center relative z-10">
        {/* Loader animation */}
        <div className="mb-8">
          {renderLoader()}
        </div>
        
        {/* Loading message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.p
            className={`text-white ${textSizes[size]} font-medium tracking-wide`}
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {message}
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-1 bg-gray-700 rounded-full mt-6 mx-auto overflow-hidden"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
