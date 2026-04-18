'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getSpeedLevel, type SpeedLevel } from '@/lib/animation-config';

interface DataFlowBackgroundProps {
  isActive: boolean;
  speed?: number;
  phase?: string;
  className?: string;
}

type Phase = string;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
}

const isDownloadPhase = (phase: Phase) => phase === 'download_running' || phase === 'download_settling';
const isUploadPhase = (phase: Phase) => phase === 'upload_running' || phase === 'upload_settling';
const isPingPhase = (phase: Phase) => phase === 'ping';
const isSettlingPhase = (phase: Phase) => phase === 'download_settling' || phase === 'upload_settling';
const isInitializingPhase = (phase: Phase) => phase === 'initializing';

export function DataFlowBackground({ isActive, speed = 0, phase = 'idle', className }: DataFlowBackgroundProps) {
  const speedLevel = getSpeedLevel(speed);
  const themeColor = getThemeColor(speedLevel);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }));
  }, []);

  const nodes = useMemo<Node[]>(() => {
    const positions = [
      { x: 15, y: 20 }, { x: 85, y: 15 }, { x: 25, y: 80 },
      { x: 75, y: 75 }, { x: 50, y: 10 }, { x: 10, y: 50 },
      { x: 90, y: 45 }, { x: 40, y: 90 }, { x: 60, y: 85 },
    ];
    return positions.map((pos, i) => ({
      id: i,
      x: pos.x,
      y: pos.y,
      connections: [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)].filter((v, i, arr) => arr.indexOf(v) === i),
    }));
  }, []);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {isActive && (
        <div 
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${themeColor}10 0%, transparent 50%)`,
          }}
        />
      )}

      <svg className="absolute inset-0 w-full h-full opacity-30">
        {nodes.map((node) =>
          node.connections.map((connId, idx) => {
            const target = nodes[connId];
            if (!target) return null;
            return (
              <line
                key={`${node.id}-${connId}-${idx}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={themeColor}
                strokeWidth="0.5"
                strokeDasharray="4 4"
                className="opacity-30"
              />
            );
          })
        )}
      </svg>

      {isActive && nodes.map((node) => (
        <motion.div
          key={`node-${node.id}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            backgroundColor: themeColor,
            boxShadow: `0 0 10px ${themeColor}`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: node.id * 0.2,
          }}
        />
      ))}

      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: themeColor,
          }}
          animate={
            isActive
              ? {
                  y: [0, -100, 0],
                  x: [0, Math.sin(particle.id) * 30, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.5, 0.5],
                }
              : {
                  y: [0, -20, 0],
                  opacity: [0.2, 0.4, 0.2],
                }
          }
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {isActive && isDownloadPhase(phase) && (
        <SignalWaves color={themeColor} />
      )}
      
      {isActive && isUploadPhase(phase) && (
        <UploadPulseLayer color={themeColor} />
      )}

      {isActive && isPingPhase(phase) && (
        <PingPulseLayer color={themeColor} />
      )}

      {isActive && isSettlingPhase(phase) && (
        <SettlingEffect color={themeColor} />
      )}

      {isActive && isInitializingPhase(phase) && (
        <InitializingEffect color={themeColor} />
      )}

      <div className="absolute inset-0 bg-background/50" />
    </div>
  );
}

function SignalWaves({ color }: { color: string }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: '50%',
            top: '50%',
            width: 100,
            height: 100,
            borderColor: color,
            opacity: 0.3 - i * 0.1,
          }}
          animate={{
            scale: [1, 3],
            opacity: [0.3 - i * 0.1, 0],
          }}
          transition={{
            duration: 2 - i * 0.3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

function UploadPulseLayer({ color }: { color: string }) {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute h-px"
          style={{
            left: `${10 + i * 20}%`,
            top: '50%',
            width: `${30 + i * 10}%`,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
          animate={{
            y: [-100, 100],
            opacity: [0, 0.6, 0],
            scaleX: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5 - i * 0.1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function PingPulseLayer({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ping-${i}`}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 ${10 + i * 5}px ${color}`,
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.33,
          }}
        />
      ))}
    </div>
  );
}

function SettlingEffect({ color }: { color: string }) {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 60%)`,
        }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}10 0%, transparent 50%)`,
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function InitializingEffect({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={`init-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            left: `${20 + i * 15}%`,
            top: '50%',
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function getThemeColor(speedLevel: SpeedLevel): string {
  switch (speedLevel) {
    case 'extreme':
      return '#ef4444';
    case 'high':
      return '#eab308';
    case 'medium':
      return '#22c55e';
    default:
      return '#0ea5e9';
  }
}