'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Download, Upload, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Stage = 
  | 'idle' 
  | 'initializing' 
  | 'ping' 
  | 'download_running'
  | 'download_settling'
  | 'upload_running'
  | 'upload_settling'
  | 'finalizing' 
  | 'completed' 
  | 'error';

interface StageInfo {
  key: Stage;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
}

const STAGES: StageInfo[] = [
  { key: 'initializing', label: 'Initializing', sublabel: 'Preparing test environment', icon: <Loader2 className="h-4 w-4 animate-spin" />, color: 'cyan' },
  { key: 'ping', label: 'Measuring Ping', sublabel: 'Testing latency and jitter', icon: <Activity className="h-4 w-4" />, color: 'cyan' },
  { key: 'download_running', label: 'Testing Download', sublabel: 'Measuring download speed', icon: <Download className="h-4 w-4" />, color: 'green' },
  { key: 'download_settling', label: 'Processing Download', sublabel: 'Settling to final value', icon: <Lock className="h-4 w-4" />, color: 'green' },
  { key: 'upload_running', label: 'Testing Upload', sublabel: 'Measuring upload speed', icon: <Upload className="h-4 w-4" />, color: 'purple' },
  { key: 'upload_settling', label: 'Processing Upload', sublabel: 'Settling to final value', icon: <Lock className="h-4 w-4" />, color: 'purple' },
  { key: 'finalizing', label: 'Analyzing Results', sublabel: 'Calculating final metrics', icon: <Loader2 className="h-4 w-4 animate-spin" />, color: 'yellow' },
  { key: 'completed', label: 'Test Complete', sublabel: 'Results ready', icon: <CheckCircle2 className="h-4 w-4" />, color: 'green' },
];

interface TestStageIndicatorProps {
  currentStage: Stage;
  progress: number;
  className?: string;
}

export function TestStageIndicator({ currentStage, progress, className }: TestStageIndicatorProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);
  const stageInfo = STAGES.find((s) => s.key === currentStage);

  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; shadow: string }> = {
      cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-400', shadow: 'shadow-cyan-500/50' },
      green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400', shadow: 'shadow-green-500/50' },
      purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-400', shadow: 'shadow-purple-500/50' },
      yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400', shadow: 'shadow-yellow-500/50' },
    };
    return colors[color] || colors.cyan;
  };

  const getBgColor = (color: string) => getColorClass(color).bg;
  const getTextColor = (color: string) => getColorClass(color).text;

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-10 mb-4">
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/10 rounded-full">
          <motion.div
            className={cn('h-full rounded-full', getBgColor(stageInfo?.color || 'cyan'))}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="flex justify-between relative">
          {STAGES.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const colorClass = getColorClass(stage.color);

            return (
              <div key={stage.key} className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    'relative z-10 w-5 h-5 rounded-full flex items-center justify-center',
                    'border-2 transition-all duration-300',
                    isCompleted && cn(colorClass.bg, colorClass.border),
                    isCurrent && cn(colorClass.bg, colorClass.border, 'shadow-lg', colorClass.shadow, 'scale-110'),
                    isPending && 'bg-background border-white/20'
                  )}
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  ) : isCurrent ? (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2">
            {stageInfo?.icon}
            <span className={cn('text-lg font-semibold', getTextColor(stageInfo?.color || 'cyan'))}>
              {stageInfo?.label || 'Ready'}
            </span>
          </div>
          <p className="text-sm text-white/50">{stageInfo?.sublabel || 'Click start to begin'}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface SimpleStageLabelProps {
  stage: string;
  className?: string;
}

export function SimpleStageLabel({ stage, className }: SimpleStageLabelProps) {
  const getStageConfig = () => {
    const configs: Record<string, { label: string; color: string; icon: React.ReactNode | null }> = {
      idle: { label: 'Ready to Test', color: 'text-white/60', icon: null },
      initializing: { label: 'Initializing', color: 'text-cyan-400', icon: <Loader2 className="h-4 w-4 animate-spin" /> },
      ping: { label: 'Measuring Ping', color: 'text-cyan-400', icon: <Activity className="h-4 w-4" /> },
      download_running: { label: 'Testing Download', color: 'text-green-400', icon: <Download className="h-4 w-4" /> },
      download_settling: { label: 'Processing Download', color: 'text-green-400', icon: <Lock className="h-4 w-4" /> },
      upload_running: { label: 'Testing Upload', color: 'text-purple-400', icon: <Upload className="h-4 w-4" /> },
      upload_settling: { label: 'Processing Upload', color: 'text-purple-400', icon: <Lock className="h-4 w-4" /> },
      finalizing: { label: 'Analyzing Results', color: 'text-yellow-400', icon: <Loader2 className="h-4 w-4 animate-spin" /> },
      completed: { label: 'Test Complete', color: 'text-green-400', icon: <CheckCircle2 className="h-4 w-4" /> },
      error: { label: 'Test Failed', color: 'text-red-400', icon: <Loader2 className="h-4 w-4" /> },
    };
    return configs[stage] || configs.idle;
  };

  const config = getStageConfig();

  return (
    <motion.div
      className={cn('flex items-center gap-2', config.color, className)}
      key={stage}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {config.icon}
      <span className="text-sm font-medium uppercase tracking-wider">{config.label}</span>
    </motion.div>
  );
}