'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

interface LiveTestChartProps {
  phase: string;
  samples: number[];
  className?: string;
}

const MAX_POINTS = 50;
const PING_MAX = 100;
const SPEED_MAX = 800;

export function LiveTestChart({ phase, samples, className }: LiveTestChartProps) {
  const isPingPhase = phase === 'ping';
  const isRunningPhase = phase === 'download_running' || phase === 'upload_running';
  const isSettlingPhase = phase === 'download_settling' || phase === 'upload_settling';

  const chartData = useMemo(() => {
    if (samples.length === 0) return [];
    return samples.slice(-MAX_POINTS).map((value, idx) => ({
      index: idx,
      value,
    }));
  }, [samples]);

  const getMaxValue = () => {
    if (isPingPhase) return PING_MAX;
    return SPEED_MAX;
  };

  const getColor = () => {
    if (isPingPhase) return '#06b6d4';
    if (phase === 'download_running' || phase === 'download_settling') return '#22c55e';
    if (phase === 'upload_running' || phase === 'upload_settling') return '#a855f7';
    return '#0ea5e9';
  };

  const chartColor = getColor();

  if (phase === 'idle' || phase === 'initializing' || phase === 'completed' || phase === 'error' || phase === 'finalizing') {
    return null;
  }

  const showChart = isPingPhase || isRunningPhase || isSettlingPhase;

  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showChart ? 1 : 0, height: showChart ? 130 : 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${phase}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="index" hide />
            <YAxis 
              domain={[0, getMaxValue()]} 
              hide 
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2.5}
              fill={`url(#gradient-${phase})`}
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {isSettlingPhase && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-green-400 text-sm font-medium"
            >
              ✓ Settling...
            </motion.div>
          </div>
        )}

        <div className="absolute top-2 left-2 flex items-center gap-2">
          <motion.div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ 
              backgroundColor: `${chartColor}20`, 
              color: chartColor,
              border: `1px solid ${chartColor}40`
            }}
            key={phase}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {isPingPhase ? 'PING' : phase.includes('download') ? 'DOWNLOAD' : 'UPLOAD'}
          </motion.div>
          
          {isSettlingPhase && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/40"
            >
              LOCKING
            </motion.div>
          )}
        </div>

        {samples.length > 0 && (
          <div className="absolute bottom-1 right-2 text-xs text-white/40">
            {isPingPhase ? 'ms' : 'Mbps'}
          </div>
        )}
      </div>
    </motion.div>
  );
}