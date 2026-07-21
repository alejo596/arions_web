import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InitialSplashLoaderProps {
  onLoadingComplete?: () => void;
  minDurationMs?: number;
}

export const InitialSplashLoader: React.FC<InitialSplashLoaderProps> = ({
  onLoadingComplete,
  minDurationMs = 2200
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [statusText, setStatusText] = useState('Iniciando plataforma ARIONS...');

  useEffect(() => {
    const startTime = Date.now();

    const textStages = [
      { threshold: 15, text: 'Iniciando módulo empresarial ARIONS...' },
      { threshold: 40, text: 'Conectando con la base de datos...' },
      { threshold: 75, text: 'Sincronizando innovación y proyectos...' },
      { threshold: 95, text: 'Carga completada ✨' }
    ];

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.round((elapsed / minDurationMs) * 100), 100);

      setProgress(calculatedProgress);

      const stage = [...textStages].reverse().find((s) => calculatedProgress >= s.threshold);
      if (stage) {
        setStatusText(stage.text);
      }

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          if (onLoadingComplete) onLoadingComplete();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDurationMs, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-splash-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-slate-900 select-none overflow-hidden"
        >
          {/* Ambient background subtle radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none" />

          {/* Central Content Box */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
            
            {/* Spinning Logo Container */}
            <div className="relative flex items-center justify-center w-40 h-40">
              {/* Outer Glowing & Spinning Gradient Ring */}
              <div
                className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-600 border-r-indigo-500 animate-spin"
                style={{ animationDuration: '3s' }}
              />

              {/* Middle Pulsing Ring */}
              <div className="absolute inset-3 rounded-full border-2 border-blue-200/70 bg-gradient-to-b from-blue-50/50 to-white shadow-inner animate-pulse" />

              {/* Central Spinning Logo */}
              <div className="relative z-10 p-2 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
                <img
                  src="/logo.png"
                  alt="ARIONS Logo Girando"
                  className="h-20 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(59,130,246,0.45)] brightness-105 contrast-110"
                />
              </div>
            </div>

            {/* Brand Title & Tagline */}
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-widest text-slate-900 font-display uppercase">
                ARIONS
              </h1>
              <p className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
                Builds AI SpA
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-2 pt-2">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Percentage & Status Text */}
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 px-1">
                <span className="truncate max-w-[200px] text-slate-600">{statusText}</span>
                <span className="font-mono font-bold text-blue-600">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
