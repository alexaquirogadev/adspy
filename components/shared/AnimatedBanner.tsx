'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBannerProps {
  text: string;
  icon: React.ReactElement<any>;
  gradient: string;
}

const AnimatedBanner: React.FC<AnimatedBannerProps> = ({ text, icon, gradient }) => {
  return (
    <div className="w-full mb-3 md:mb-4">
      <div className={`bg-gradient-to-r ${gradient} border-2 border-black rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] overflow-hidden h-8 md:h-10 relative`}>
        <motion.div
          className="absolute inset-0 flex items-center whitespace-nowrap"
          animate={{
            x: ['0%', '-80%']
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Crear un bucle continuo duplicando el contenido */}
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex items-center px-4">
              <span className="text-black font-bold text-xs md:text-sm">{text}</span>
              <motion.span
                animate={{ 
                  rotate: [0, -10, 10, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-block ml-2 mr-2 text-black md:w-4 md:h-4"
              >
                {icon}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedBanner;