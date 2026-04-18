'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getSpeedLevel } from '@/lib/animation-config';

interface AnimatedMetricValueProps {
  targetValue: number;
  isActive: boolean;
  unit?: string;
  label?: string;
  className?: string;
}

export function AnimatedMetricValue({
  targetValue,
  isActive,
  unit = 'Mbps',
  label,
  className,
}: AnimatedMetricValueProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const targetRef = useRef(targetValue);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = targetValue;
  }, [targetValue]);

  const animateValue = useCallback(() => {
    setDisplayValue((prev) => {
      const diff = targetRef.current - prev;
      if (Math.abs(diff) < 0.5) {
        setIsAnimating(false);
        return targetRef.current;
      }

      setIsAnimating(true);
      const step = diff * 0.06;
      const noise = (Math.random() - 0.5) * Math.abs(diff) * 0.03;
      
      return prev + step + noise;
    });

    if (isActive) {
      animationRef.current = requestAnimationFrame(animateValue);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(animateValue);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsAnimating(false);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animateValue]);

  const speedLevel = getSpeedLevel(displayValue);
  const colorClass = speedLevel === 'extreme' ? 'text-red-400' : speedLevel === 'high' ? 'text-yellow-400' : 'text-white';

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="text-center">
        <motion.div
          className={`text-5xl font-bold tracking-wider ${colorClass}`}
          animate={
            isAnimating
              ? {
                  textShadow: [
                    '0 0 20px currentColor',
                    '0 0 40px currentColor',
                    '0 0 20px currentColor',
                  ],
                }
              : {}
          }
          transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
        >
          {Math.round(displayValue)}
          <span className="text-2xl ml-1 opacity-70">{unit}</span>
        </motion.div>

        {label && (
          <motion.div
            className="text-sm text-white/50 mt-2 uppercase tracking-widest"
            animate={isAnimating ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
          >
            {label}
          </motion.div>
        )}

        {isActive && (
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`bar-${i}`}
                className="w-1 bg-white/30 rounded-full"
                animate={{
                  height: [8, 16 + Math.random() * 8, 8],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface PingDisplayProps {
  ping: number;
  jitter: number;
  isActive: boolean;
}

export function PingDisplay({ ping, jitter, isActive }: PingDisplayProps) {
  const [displayPing, setDisplayPing] = useState(0);
  const [displayJitter, setDisplayJitter] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplayPing(0);
      setDisplayJitter(0);
      return;
    }

    const pingInterval = setInterval(() => {
      setDisplayPing((prev) => {
        const target = ping || Math.random() * 50 + 10;
        const diff = target - prev;
        return prev + diff * 0.1;
      });
    }, 100);

    const jitterInterval = setInterval(() => {
      setDisplayJitter((prev) => {
        const target = jitter || Math.random() * 5 + 1;
        const diff = target - prev;
        return prev + diff * 0.1;
      });
    }, 150);

    return () => {
      clearInterval(pingInterval);
      clearInterval(jitterInterval);
    };
  }, [isActive, ping, jitter]);

  const getPingColor = (ms: number) => {
    if (ms > 100) return 'text-red-400';
    if (ms > 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <motion.div
      className="flex items-center gap-6 mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
    >
      <div className="text-center">
        <div className={`text-2xl font-bold ${getPingColor(displayPing)}`}>
          {displayPing.toFixed(1)}
          <span className="text-sm ml-1 opacity-60">ms</span>
        </div>
        <div className="text-xs text-white/40 uppercase tracking-wider">Ping</div>
      </div>
      
      <div className="w-px h-10 bg-white/10" />
      
      <div className="text-center">
        <div className="text-2xl font-bold text-cyan-400">
          {displayJitter.toFixed(2)}
          <span className="text-sm ml-1 opacity-60">ms</span>
        </div>
        <div className="text-xs text-white/40 uppercase tracking-wider">Jitter</div>
      </div>
    </motion.div>
  );
}