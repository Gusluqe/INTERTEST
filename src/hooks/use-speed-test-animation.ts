'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ANIMATION_CONFIG } from '@/lib/animation-config';
import { TestPhase, TEST_PHASES, getNextPhase, isRunningPhase, isSettlingPhase } from '@/lib/test-state-machine';
import { lerp, clamp } from '@/lib/easing';

function isActivePhase(phase: TestPhase): boolean {
  return phase !== 'idle' && phase !== 'completed' && phase !== 'error';
}

interface TestAnimationState {
  phase: TestPhase;
  displaySpeed: number;
  targetSpeed: number;
  ping: number;
  jitter: number;
  progress: number;
  samples: number[];
  isLocked: boolean;
}

interface UseSpeedTestAnimationReturn {
  state: TestAnimationState;
  isRunning: boolean;
  isComplete: boolean;
  start: () => void;
  stop: () => void;
}

export function useSpeedTestAnimation(): UseSpeedTestAnimationReturn {
  const [state, setState] = useState<TestAnimationState>({
    phase: 'idle',
    displaySpeed: 0,
    targetSpeed: 0,
    ping: 0,
    jitter: 0,
    progress: 0,
    samples: [],
    isLocked: false,
  });

  const animationRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef(0);
  const testStartTimeRef = useRef(0);
  const isRunningRef = useRef(false);
  const settledValueRef = useRef(0);

  const generateDownloadCurve = useCallback((progress: number, elapsed: number): number => {
    const { curves, slots } = ANIMATION_CONFIG;
    const cfg = curves.download;
    
    const target = slots.targetSpeed + (Math.random() - 0.5) * slots.variationRange;
    
    if (progress < 0.1) {
      return progress * 10 * 80;
    }

    const accelerationFactor = Math.pow(progress, cfg.acceleration);
    const rampUp = accelerationFactor * target * 0.6;
    
    const peakPhase = progress > 0.4 && progress < 0.7;
    const peak = peakPhase ? Math.sin((progress - 0.4) * Math.PI / 0.3) * target * cfg.peakMultiplier * 0.3 : 0;
    
    const noise = (Math.random() - 0.5) * target * cfg.fluctuation * 2;
    
    const decelerateStart = cfg.decelerationStart;
    let deceleration = 0;
    if (progress > decelerateStart) {
      const decelProgress = (progress - decelerateStart) / (1 - decelerateStart);
      deceleration = decelProgress * decelProgress * target * 0.4;
    }

    const oscillation = Math.sin(elapsed * 0.008) * target * 0.05;
    
    return clamp(rampUp + peak + noise + oscillation - deceleration, 0, 800);
  }, []);

  const generateUploadCurve = useCallback((progress: number, elapsed: number): number => {
    const { curves, slots } = ANIMATION_CONFIG;
    const cfg = curves.upload;
    
    const target = slots.targetSpeed * 0.6 + (Math.random() - 0.5) * slots.variationRange * 0.5;
    
    if (progress < 0.15) {
      return progress * 6.67 * 50;
    }

    const softGrowth = Math.pow(progress, 1.8) * 0.5 + progress * 0.4;
    const baseValue = softGrowth * target;

    const technicalPeak = progress > 0.5 && progress < 0.8 
      ? Math.sin((progress - 0.5) * Math.PI / 0.3 + 1) * target * cfg.peakMultiplier * 0.25 
      : 0;

    const microVariation = Math.sin(elapsed * 0.015) * target * 0.03 + Math.sin(elapsed * 0.05) * target * 0.02;

    const lateRise = progress > 0.7 ? Math.sin((progress - 0.7) * Math.PI * 2.5) * target * 0.15 : 0;

    let deceleration = 0;
    if (progress > 0.8) {
      const decelProgress = (progress - 0.8) / 0.2;
      deceleration = decelProgress * decelProgress * target * 0.3;
    }

    return clamp(baseValue + technicalPeak + microVariation + lateRise - deceleration, 0, 500);
  }, []);

  const generatePingValue = useCallback((progress: number): number => {
    const basePing = 25 + Math.random() * 10;
    const variation = Math.sin(progress * Math.PI * 3) * 8;
    const noise = (Math.random() - 0.5) * 4;
    return clamp(basePing + variation + noise, 5, 80);
  }, []);

  const runSettlingAnimation = useCallback((currentSpeed: number, finalValue: number): number => {
    const { settling } = ANIMATION_CONFIG;
    const diff = finalValue - currentSpeed;
    
    if (Math.abs(diff) < 1) return finalValue;
    
    const bouncePhase = Math.sin(Date.now() * 0.01) * settling.bounceIntensity * finalValue;
    const converged = lerp(currentSpeed, finalValue, settling.convergenceSpeed);
    
    return converged + bouncePhase;
  }, []);

  const animate = useCallback(() => {
    if (!isRunningRef.current) return;

    const now = Date.now();
    const phaseElapsed = now - phaseStartTimeRef.current;
    const testElapsed = now - testStartTimeRef.current;

    const phaseConfig = TEST_PHASES[state.phase];
    const phaseProgress = phaseConfig.duration > 0 ? clamp(phaseElapsed / phaseConfig.duration, 0, 1) : 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _overallProgress = testElapsed / 15000;

    setState(prev => {
      const newState = { ...prev };

      if (isRunningPhase(prev.phase)) {
        const phaseProgressNorm = phaseElapsed / phaseConfig.duration;
        
        if (prev.phase === 'ping') {
          const ping = generatePingValue(phaseProgressNorm);
          const jitter = Math.random() * 4 + 1;
          
          newState.ping = ping;
          newState.jitter = jitter;
          newState.samples = [...prev.samples.slice(-10), ping];
        } 
        else if (prev.phase === 'download_running') {
          const speed = generateDownloadCurve(phaseProgressNorm, phaseElapsed);
          newState.displaySpeed = speed;
          newState.targetSpeed = speed;
          newState.samples = [...prev.samples.slice(-20), speed];
        }
        else if (prev.phase === 'upload_running') {
          const speed = generateUploadCurve(phaseProgressNorm, phaseElapsed);
          newState.displaySpeed = speed;
          newState.targetSpeed = speed;
          newState.samples = [...prev.samples.slice(-20), speed];
        }

        newState.progress = phaseProgress * 100;

        if (phaseElapsed >= phaseConfig.duration) {
          const nextPhase = getNextPhase(prev.phase);
          if (nextPhase) {
            if (prev.phase === 'download_running') {
              settledValueRef.current = prev.displaySpeed;
            } else if (prev.phase === 'upload_running') {
              settledValueRef.current = prev.displaySpeed;
            }
            return { ...newState, phase: nextPhase, progress: 0 };
          }
        }
      }
      else if (isSettlingPhase(prev.phase)) {
        newState.displaySpeed = runSettlingAnimation(prev.displaySpeed, settledValueRef.current);
        newState.progress = 100 - ((phaseElapsed / phaseConfig.duration) * 100);
        
        if (phaseElapsed >= phaseConfig.duration) {
          newState.displaySpeed = settledValueRef.current;
          newState.isLocked = true;
          
          const nextPhase = getNextPhase(prev.phase);
          if (nextPhase) {
            return { ...newState, phase: nextPhase, progress: 0, isLocked: false };
          }
        }
      }
      else if (prev.phase === 'initializing' || prev.phase === 'finalizing') {
        newState.progress = phaseProgress * 100;
        
        if (phaseElapsed >= phaseConfig.duration) {
          const nextPhase = getNextPhase(prev.phase);
          if (nextPhase) {
            return { ...newState, phase: nextPhase, progress: 0 };
          }
        }
      }
      else if (prev.phase === 'completed') {
        newState.isLocked = true;
      }

      return newState;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [state.phase, generateDownloadCurve, generateUploadCurve, generatePingValue, runSettlingAnimation]);

  useEffect(() => {
    if (isRunningRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const start = useCallback(() => {
    isRunningRef.current = true;
    testStartTimeRef.current = Date.now();
    phaseStartTimeRef.current = Date.now();
    settledValueRef.current = 0;

    setState({
      phase: 'initializing',
      displaySpeed: 0,
      targetSpeed: 0,
      ping: 0,
      jitter: 0,
      progress: 0,
      samples: [],
      isLocked: false,
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setState({
      phase: 'idle',
      displaySpeed: 0,
      targetSpeed: 0,
      ping: 0,
      jitter: 0,
      progress: 0,
      samples: [],
      isLocked: false,
    });
  }, []);

  const isComplete = state.phase === 'completed';
  const isRunning = isActivePhase(state.phase) && state.phase !== 'idle';

  return {
    state,
    isRunning,
    isComplete,
    start,
    stop,
  };
}