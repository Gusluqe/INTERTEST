'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, XCircle, Download, Upload, Activity, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTestStore } from '@/store/test-store';
import { formatSpeed, formatLatency, formatJitter, cn } from '@/lib/utils';
import { SpeedBubble } from './speed-bubble';
import { PingDisplay } from './animated-metric-value';
import { LiveTestChart } from './live-test-chart';
import { SimpleStageLabel } from './test-stage-indicator';
import { DataFlowBackground } from './data-flow-background';
import { useSpeedTestAnimation } from '@/hooks/use-speed-test-animation';
import { TestPhase } from '@/lib/test-state-machine';

export function SpeedTest() {
  const { isRunning: storeRunning, results, error, startTest, cancelTest } = useTestStore();
  const { state, isComplete, start, stop } = useSpeedTestAnimation();

  const isTestActive = storeRunning || state.phase !== 'idle';

  const handleStart = async () => {
    if (storeRunning) {
      cancelTest();
      stop();
    } else {
      start();
      startTest();
    }
  };

  const currentSpeed = isComplete && results ? results.download.speed : state.displaySpeed;
  const currentPing = state.phase === 'ping' ? state.ping : (results?.ping.ping || 0);
  const currentJitter = state.phase === 'ping' ? state.jitter : (results?.ping.jitter || 0);

  const getOverallProgress = (): number => {
    const phaseOrder: TestPhase[] = ['idle', 'initializing', 'ping', 'download_running', 'download_settling', 'upload_running', 'upload_settling', 'finalizing', 'completed'];
    const idx = phaseOrder.indexOf(state.phase);
    if (idx === -1) return 0;
    
    const phaseWeight = 100 / phaseOrder.length;
    const baseProgress = idx * phaseWeight;
    
    const phaseProgress = state.progress;
    return baseProgress + (phaseProgress / 100) * phaseWeight;
  };

  const overallProgress = isComplete ? 100 : getOverallProgress();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="relative overflow-hidden glass border-0">
        <DataFlowBackground 
          isActive={isTestActive} 
          speed={currentSpeed} 
          phase={state.phase}
        />
        
        <CardContent className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col items-center space-y-6">
            <SpeedBubble
              speed={currentSpeed}
              isActive={isTestActive}
              phase={state.phase}
              isLocked={state.isLocked}
            />

            <SimpleStageLabel stage={state.phase} />

            <LiveTestChart
              phase={state.phase as 'ping' | 'download_running' | 'upload_running' | 'idle' | 'completed' | 'error'}
              samples={state.samples}
            />

            {state.phase !== 'idle' && state.phase !== 'initializing' && (
              <PingDisplay
                ping={currentPing}
                jitter={currentJitter}
                isActive={state.phase === 'ping'}
              />
            )}

            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Progress</span>
                <div className="flex items-center gap-2">
                  {state.isLocked && <Lock className="h-3 w-3 text-green-400" />}
                  <span className="font-medium text-white">{Math.round(overallProgress)}%</span>
                </div>
              </div>
              <Progress 
                value={overallProgress} 
                className="h-2 bg-white/10"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-400"
              >
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <Button
              size="xl"
              onClick={handleStart}
              className={cn(
                'min-w-[200px] relative overflow-hidden transition-all duration-300',
                storeRunning && 'bg-red-600 hover:bg-red-700'
              )}
            >
              {storeRunning ? (
                <>
                  <XCircle className="mr-2 h-5 w-5" />
                  Stop Test
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Start Test
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isComplete && results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <ResultsSummary results={results} />
            <QualityScore results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultsSummary({ results }: { results: ReturnType<typeof useTestStore.getState>['results'] }) {
  if (!results) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ResultCard
        icon={<Activity className="h-5 w-5 text-cyan-400" />}
        label="Ping"
        value={formatLatency(results.ping.ping)}
        subValue={`Jitter: ${formatJitter(results.ping.jitter)}`}
      />
      <ResultCard
        icon={<Download className="h-5 w-5 text-green-400" />}
        label="Download"
        value={formatSpeed(results.download.speed)}
        subValue={`${results.download.samples.length} samples`}
      />
      <ResultCard
        icon={<Upload className="h-5 w-5 text-purple-400" />}
        label="Upload"
        value={formatSpeed(results.upload.speed)}
        subValue={`${results.upload.samples.length} samples`}
      />
    </div>
  );
}

function ResultCard({ 
  icon, 
  label, 
  value, 
  subValue 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subValue: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <Card className="glass hover:border-primary/30 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            {icon}
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{subValue}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QualityScore({ results }: { results: ReturnType<typeof useTestStore.getState>['results'] }) {
  if (!results) return null;
  
  const quality = (results as any).quality;
  if (!quality) return null;

  const ratingColors = {
    excellent: 'bg-green-500/10 text-green-500 border-green-500/20',
    good: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    fair: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    poor: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Connection Quality</div>
              <div className="text-5xl font-bold text-gradient">{quality.score}</div>
              <div className="text-sm text-muted-foreground">/ 100</div>
            </div>
          </div>
          <div className="text-right">
            <Badge className={ratingColors[quality.rating as keyof typeof ratingColors]}>
              {quality.rating.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              {quality.recommendation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}