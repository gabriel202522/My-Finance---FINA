
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    const interval = setInterval(() => {
        setProgress(p => Math.min(p + 1, 100));
    }, 28);

    return () => {
        clearTimeout(timer);
        clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">
                Montando a melhor estrutura financeira para você...
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                ></motion.div>
            </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoadingScreen;
