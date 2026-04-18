import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TestStore, ServerInfo, SpeedTestResult, PingResult, DownloadResult, UploadResult } from '@/types';

const DEFAULT_SERVERS: ServerInfo[] = [
  { name: 'US East', location: 'New York, NY', host: 'speedtest.example.com' },
  { name: 'EU West', location: 'Frankfurt, DE', host: 'speedtest-eu.example.com' },
  { name: 'Asia Pacific', location: 'Tokyo, JP', host: 'speedtest-ap.example.com' },
];

function generateId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateQualityScore(ping: number, download: number, upload: number, jitter: number): { score: number; rating: string; recommendation: string } {
  let score = 100;

  if (ping > 100) score -= 20;
  else if (ping > 50) score -= 10;
  else if (ping > 20) score -= 5;

  if (jitter > 30) score -= 15;
  else if (jitter > 15) score -= 10;
  else if (jitter > 5) score -= 5;

  if (download < 5) score -= 30;
  else if (download < 25) score -= 15;
  else if (download < 50) score -= 5;

  if (upload < 2) score -= 25;
  else if (upload < 10) score -= 12;
  else if (upload < 20) score -= 5;

  score = Math.max(0, Math.min(100, score));

  let rating: string;
  let recommendation: string;

  if (score >= 80) {
    rating = 'excellent';
    recommendation = 'Perfect for gaming, 4K streaming, and video calls';
  } else if (score >= 60) {
    rating = 'good';
    recommendation = 'Great for HD streaming and remote work';
  } else if (score >= 40) {
    rating = 'fair';
    recommendation = 'Suitable for basic streaming and video calls';
  } else {
    rating = 'poor';
    recommendation = 'May experience issues with streaming and video calls';
  }

  return { score, rating, recommendation };
}

async function runPingTest(): Promise<PingResult> {
  const samples: number[] = [];

  for (let i = 0; i < 8; i++) {
    const reqStart = performance.now();
    try {
      await fetch('/api/ping?_=' + Date.now(), { 
        cache: 'no-store',
        mode: 'cors'
      });
      const latency = performance.now() - reqStart;
      if (latency < 1000) {
        samples.push(latency);
      }
    } catch {
      samples.push(performance.now() - reqStart);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  if (samples.length === 0) {
    return { ping: 0, jitter: 0, packetsLost: 8, samples: [] };
  }

  samples.sort((a, b) => a - b);
  const trimmed = samples.slice(1, -1);
  const avgPing = trimmed.length > 0
    ? trimmed.reduce((a, b) => a + b, 0) / trimmed.length
    : samples[0];

  let jitter = 0;
  for (let i = 1; i < samples.length; i++) {
    jitter += Math.abs(samples[i] - samples[i - 1]);
  }
  jitter = samples.length > 1 ? jitter / (samples.length - 1) : 0;

  return {
    ping: Math.round(avgPing * 10) / 10,
    jitter: Math.round(jitter * 10) / 10,
    packetsLost: 8 - samples.length,
    samples,
  };
}

async function runDownloadTest(onProgress?: () => void): Promise<DownloadResult> {
  const samples: number[] = [];
  const totalIterations = 5;
  const chunkSize = 1024 * 1024;

  for (let i = 0; i < totalIterations; i++) {
    const startTime = performance.now();
    try {
      const response = await fetch(`/api/download?size=${chunkSize}&_=${Date.now()}`, {
        cache: 'no-store',
        mode: 'cors'
      });
      await response.arrayBuffer();
      const duration = (performance.now() - startTime) / 1000;
      const speedMbps = (chunkSize * 8) / (duration * 1000000);
      samples.push(speedMbps);
    } catch {
      samples.push(0);
    }
    if (onProgress) onProgress();
  }

  if (samples.length === 0 || samples.every(s => s === 0)) {
    return { speed: 0, progress: 100, samples: [] };
  }

  const validSamples = samples.filter(s => s > 0);
  const avgSpeed = validSamples.reduce((a, b) => a + b, 0) / validSamples.length;

  return {
    speed: Math.round(avgSpeed * 10) / 10,
    progress: 100,
    samples,
  };
}

async function runUploadTest(onProgress?: () => void): Promise<UploadResult> {
  const samples: number[] = [];
  const totalIterations = 4;
  const chunkSize = 512 * 1024;

  for (let i = 0; i < totalIterations; i++) {
    const startTime = performance.now();
    try {
      const data = new Uint8Array(chunkSize);
      for (let j = 0; j < chunkSize; j++) {
        data[j] = Math.floor(Math.random() * 256);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/octet-stream' },
        cache: 'no-store',
        mode: 'cors'
      });

      if (!response.ok) throw new Error('Upload failed');

      const duration = (performance.now() - startTime) / 1000;
      const speedMbps = (chunkSize * 8) / (duration * 1000000);
      samples.push(speedMbps);
    } catch {
      samples.push(0);
    }
    if (onProgress) onProgress();
  }

  if (samples.length === 0 || samples.every(s => s === 0)) {
    return { speed: 0, progress: 100, samples: [] };
  }

  const validSamples = samples.filter(s => s > 0);
  const avgSpeed = validSamples.reduce((a, b) => a + b, 0) / validSamples.length;

  return {
    speed: Math.round(avgSpeed * 10) / 10,
    progress: 100,
    samples,
  };
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      phase: 'idle',
      isRunning: false,
      results: null,
      history: [],
      currentServer: DEFAULT_SERVERS[0],
      servers: DEFAULT_SERVERS,
      error: null,

      startTest: async () => {
        const store = get();
        if (store.isRunning) return;

        set({ phase: 'ping', isRunning: true, error: null, results: null });

        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
          const pingResult = await runPingTest();
          set({ phase: 'download' });
          
          await new Promise(resolve => setTimeout(resolve, 500));

          const downloadResult = await runDownloadTest(() => {
            set({ phase: 'download' });
          });
          
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set({ phase: 'upload' });
          
          await new Promise(resolve => setTimeout(resolve, 500));

          const uploadResult = await runUploadTest(() => {
            set({ phase: 'upload' });
          });

          set({ phase: 'complete', isRunning: false, results: null });
          
          await new Promise(resolve => setTimeout(resolve, 2000));

          const finalResult: SpeedTestResult = {
            id: generateId(),
            timestamp: Date.now(),
            ping: pingResult,
            download: downloadResult,
            upload: uploadResult,
            server: store.currentServer,
          };

          const quality = calculateQualityScore(
            pingResult.ping,
            downloadResult.speed,
            uploadResult.speed,
            pingResult.jitter
          );

          (finalResult as any).quality = quality;

          set({
            phase: 'complete',
            isRunning: false,
            results: finalResult,
            history: [finalResult, ...store.history].slice(0, 50),
          });
        } catch (error) {
          set({
            phase: 'error',
            isRunning: false,
            error: error instanceof Error ? error.message : 'Test failed',
          });
        }
      },

      cancelTest: () => {
        set({ phase: 'idle', isRunning: false, error: null });
      },

      setServer: (server: ServerInfo) => {
        set({ currentServer: server });
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'netcheck-pro-storage',
      partialize: (state) => ({ history: state.history }),
    }
  )
);