export type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'complete' | 'error';

export interface PingResult {
  ping: number;
  jitter: number;
  packetsLost: number;
  samples: number[];
}

export interface DownloadResult {
  speed: number;
  progress: number;
  samples: number[];
}

export interface UploadResult {
  speed: number;
  progress: number;
  samples: number[];
}

export interface SpeedTestResult {
  id: string;
  timestamp: number;
  ping: PingResult;
  download: DownloadResult;
  upload: UploadResult;
  server: ServerInfo;
  connectionType?: string;
}

export interface ServerInfo {
  name: string;
  location: string;
  host: string;
  ip?: string;
}

export interface TestStore {
  phase: TestPhase;
  isRunning: boolean;
  results: SpeedTestResult | null;
  history: SpeedTestResult[];
  currentServer: ServerInfo;
  servers: ServerInfo[];
  error: string | null;
  startTest: () => Promise<void>;
  cancelTest: () => void;
  setServer: (server: ServerInfo) => void;
  clearHistory: () => void;
}

export interface ConnectionQuality {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  recommendation: string;
}