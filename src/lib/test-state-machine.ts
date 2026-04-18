export type TestPhase = 
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

export interface TestPhaseConfig {
  key: TestPhase;
  label: string;
  duration: number;
  isSettling: boolean;
  shouldGenerateValue: boolean;
}

export const TEST_PHASES: Record<TestPhase, TestPhaseConfig> = {
  idle: { key: 'idle', label: 'Ready to Test', duration: 0, isSettling: false, shouldGenerateValue: false },
  initializing: { key: 'initializing', label: 'Initializing', duration: 1500, isSettling: false, shouldGenerateValue: false },
  ping: { key: 'ping', label: 'Measuring Ping', duration: 2000, isSettling: false, shouldGenerateValue: true },
  download_running: { key: 'download_running', label: 'Testing Download', duration: 5000, isSettling: false, shouldGenerateValue: true },
  download_settling: { key: 'download_settling', label: 'Processing Download', duration: 1200, isSettling: true, shouldGenerateValue: false },
  upload_running: { key: 'upload_running', label: 'Testing Upload', duration: 5000, isSettling: false, shouldGenerateValue: true },
  upload_settling: { key: 'upload_settling', label: 'Processing Upload', duration: 1200, isSettling: true, shouldGenerateValue: false },
  finalizing: { key: 'finalizing', label: 'Analyzing Results', duration: 1800, isSettling: false, shouldGenerateValue: false },
  completed: { key: 'completed', label: 'Test Complete', duration: 0, isSettling: false, shouldGenerateValue: false },
  error: { key: 'error', label: 'Test Failed', duration: 0, isSettling: false, shouldGenerateValue: false },
};

export const PHASE_ORDER: TestPhase[] = [
  'idle',
  'initializing',
  'ping',
  'download_running',
  'download_settling',
  'upload_running',
  'upload_settling',
  'finalizing',
  'completed',
];

export function getNextPhase(current: TestPhase): TestPhase | null {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx === -1 || idx >= PHASE_ORDER.length - 1) return null;
  return PHASE_ORDER[idx + 1];
}

export function isRunningPhase(phase: TestPhase): boolean {
  return phase === 'ping' || phase === 'download_running' || phase === 'upload_running';
}

export function isSettlingPhase(phase: TestPhase): boolean {
  return phase === 'download_settling' || phase === 'upload_settling';
}

export function isActivePhase(phase: TestPhase): boolean {
  return phase !== 'idle' && phase !== 'completed' && phase !== 'error';
}