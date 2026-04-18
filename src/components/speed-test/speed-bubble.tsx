'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG, getSpeedLevel } from '@/lib/animation-config';

interface SpeedBubbleProps {
  speed: number;
  isActive: boolean;
  phase: string;
  isLocked?: boolean;
  className?: string;
}

export function SpeedBubble({ speed, isActive, phase, isLocked = false, className }: SpeedBubbleProps) {
  const speedLevel = getSpeedLevel(speed);
  const { colors } = ANIMATION_CONFIG;
  const config = ANIMATION_CONFIG.bubble;

  const [displaySpeed, setDisplaySpeed] = useState(0);
  const targetSpeed = useRef(speed);
  const lockedSpeedRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      lockedSpeedRef.current = speed;
    }
  }, [isLocked, speed]);

  useEffect(() => {
    targetSpeed.current = speed;
  }, [speed]);

  useEffect(() => {
    if (!isActive && !isLocked) {
      setDisplaySpeed(0);
      return;
    }

    if (isLocked) {
      const diff = lockedSpeedRef.current - displaySpeed;
      if (Math.abs(diff) > 0.5) {
        const step = () => {
          const newDiff = lockedSpeedRef.current - displaySpeed;
          if (Math.abs(newDiff) > 0.5) {
            setDisplaySpeed(prev => prev + newDiff * 0.2);
            requestAnimationFrame(step);
          } else {
            setDisplaySpeed(lockedSpeedRef.current);
          }
        };
        requestAnimationFrame(step);
      }
      return;
    }

    const step = () => {
      const diff = targetSpeed.current - displaySpeed;
      const stepSize = diff * 0.1;
      
      if (Math.abs(diff) > 1) {
        const noise = (Math.random() - 0.5) * diff * 0.03;
        setDisplaySpeed((prev) => Math.max(0, prev + stepSize + noise));
        requestAnimationFrame(step);
      } else {
        setDisplaySpeed(targetSpeed.current);
      }
    };

    const timeout = setTimeout(step, 16);
    return () => clearTimeout(timeout);
  }, [isActive, isLocked, displaySpeed]);

  const currentColor = speedLevel === 'extreme' ? colors.red.primary : 
                      speedLevel === 'high' ? colors.yellow.primary : 
                      colors.green.primary;
  const currentGradient = speedLevel === 'extreme' ? colors.red.gradient : 
                         speedLevel === 'high' ? colors.yellow.gradient : 
                         colors.green.gradient;

  const glowIntensity = speedLevel === 'extreme' ? config.glowIntensity.high : 
                       speedLevel === 'high' ? config.glowIntensity.medium : 
                       config.glowIntensity.low;

  const isComplete = phase === 'completed' || phase === 'complete';

  const showValue = isActive || isLocked || isComplete;
  const bubbleScale = isLocked ? 1.05 : isActive ? 1 : 1;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <motion.div
        className="relative"
        animate={{ scale: bubbleScale }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={cn(
            'relative rounded-full flex items-center justify-center',
            'bg-gradient-to-br',
            currentGradient,
            'shadow-2xl'
          )}
          animate={isLocked ? { scale: [1, 1.03, 1] } : isActive ? { scale: [1, 1.01, 1] } : {}}
          transition={isLocked ? { duration: 0.5 } : { duration: config.pulseSpeed, repeat: isActive ? Infinity : 0 }}
          style={{
            width: config.size,
            height: config.size,
            boxShadow: isLocked
              ? `
                0 0 ${glowIntensity * 1.5}px ${currentColor}60,
                0 0 ${glowIntensity * 2}px ${currentColor}40,
                0 0 ${glowIntensity * 3}px ${currentColor}20,
                inset 0 0 40px rgba(255,255,255,0.3)
              `
              : `
                0 0 ${glowIntensity}px ${currentColor}40,
                0 0 ${glowIntensity * 1.5}px ${currentColor}20,
                0 0 ${glowIntensity * 2}px ${currentColor}10,
                inset 0 0 30px rgba(255,255,255,0.2)
              `,
          }}
        >
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
            }}
          />

          <div className="relative z-10 text-center">
            {showValue ? (
              <motion.div
                key={displaySpeed}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-1"
              >
                <motion.div
                  className="text-4xl font-bold tracking-wider text-white"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Math.round(displaySpeed)}
                  <span className="text-xl ml-1">Mbps</span>
                </motion.div>
                
                {isActive && !isLocked && (
                  <motion.div
                    className="text-xs text-white/60 uppercase tracking-widest"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {speedLevel === 'extreme' ? '🔥 MAX' : speedLevel === 'high' ? '⚡ FAST' : '📶 TESTING'}
                  </motion.div>
                )}

                {isLocked && (
                  <motion.div
                    className="text-xs text-green-300 uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✓ LOCKED
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-white/80">NetPulse</div>
                <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Speed Test</div>
              </div>
            )}
          </div>

          {(isActive || isLocked) && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
                }}
                animate={{ opacity: isLocked ? [0.5, 0.7, 0.5] : [0.3, 0.6, 0.3] }}
                transition={{ duration: isLocked ? 1.5 : 2, repeat: Infinity }}
              />
              
              <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${currentColor}30 0%, transparent 70%)`,
                }}
                animate={{ scale: isLocked ? [1, 1.05, 1] : [1, 1.1, 1], opacity: isLocked ? [0.5, 0.7, 0.5] : [0.3, 0.5, 0.3] }}
                transition={{ duration: isLocked ? 1 : 3, repeat: Infinity }}
              />

              <motion.div
                className="absolute -inset-8 rounded-full"
                style={{
                  border: `1px solid ${currentColor}30`,
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </>
          )}
        </motion.div>
      </motion.div>

      {isActive && !isLocked && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute rounded-full border border-white/10"
              style={{
                width: config.size + 40 + i * 30,
                height: config.size + 40 + i * 30,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}