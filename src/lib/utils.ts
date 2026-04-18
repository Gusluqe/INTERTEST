import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSpeed(mbps: number): string {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(2)} Gbps`;
  }
  return `${mbps.toFixed(1)} Mbps`;
}

export function formatLatency(ms: number): string {
  return `${ms.toFixed(1)} ms`;
}

export function formatJitter(ms: number): string {
  return `${ms.toFixed(2)} ms`;
}

export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let value = bytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getProgressColor(progress: number): string {
  if (progress < 30) return 'text-red-500';
  if (progress < 60) return 'text-yellow-500';
  if (progress < 80) return 'text-green-400';
  return 'text-green-500';
}

export function getLatencyColor(ms: number): string {
  if (ms > 100) return 'text-red-500';
  if (ms > 50) return 'text-yellow-500';
  if (ms > 20) return 'text-green-400';
  return 'text-green-500';
}

export function getSpeedColor(mbps: number): string {
  if (mbps < 10) return 'text-red-500';
  if (mbps < 30) return 'text-yellow-500';
  if (mbps < 100) return 'text-green-400';
  return 'text-green-500';
}

export function generateTestId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}