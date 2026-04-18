export interface SpeedCurveConfig {
  peakMultiplier: number;
  baseProgress: number;
  fluctuation: number;
  acceleration: number;
  decelerationStart: number;
}

export interface TestTimingConfig {
  initializing: number;
  ping: number;
  downloadRunning: number;
  downloadSettling: number;
  uploadRunning: number;
  uploadSettling: number;
  finalizing: number;
}

export const ANIMATION_CONFIG = {
  thresholds: {
    green: 250,
    yellow: 500,
    red: 700,
  },
  colors: {
    green: {
      primary: '#22c55e',
      glow: 'rgba(34, 197, 94, 0.5)',
      gradient: 'from-green-400 via-green-500 to-green-600',
    },
    yellow: {
      primary: '#eab308',
      glow: 'rgba(234, 179, 8, 0.5)',
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
    },
    red: {
      primary: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.5)',
      gradient: 'from-red-400 via-red-500 to-red-600',
    },
  },
  timing: {
    initializing: 1500,
    ping: 2000,
    downloadRunning: 5000,
    downloadSettling: 1200,
    uploadRunning: 5000,
    uploadSettling: 1200,
    finalizing: 1800,
  } as TestTimingConfig,
  curves: {
    download: {
      peakMultiplier: 1.4,
      baseProgress: 0.3,
      fluctuation: 0.15,
      acceleration: 1.8,
      decelerationStart: 0.75,
    } as SpeedCurveConfig,
    upload: {
      peakMultiplier: 1.2,
      baseProgress: 0.2,
      fluctuation: 0.08,
      acceleration: 1.5,
      decelerationStart: 0.7,
    } as SpeedCurveConfig,
  },
  bubble: {
    size: 200,
    glowIntensity: {
      low: 20,
      medium: 40,
      high: 60,
    },
    pulseSpeed: 2,
  },
  settling: {
    bounceCount: 3,
    bounceIntensity: 0.02,
    finalGlowDuration: 500,
    convergenceSpeed: 0.15,
  },
  slots: {
    targetSpeed: 650,
    variationRange: 150,
    peakHoldDuration: 0.3,
  },
};

export type SpeedLevel = 'low' | 'medium' | 'high' | 'extreme';

export function getSpeedLevel(speed: number): SpeedLevel {
  const { thresholds } = ANIMATION_CONFIG;
  if (speed >= thresholds.red) return 'extreme';
  if (speed >= thresholds.yellow) return 'high';
  if (speed >= thresholds.green) return 'medium';
  return 'low';
}