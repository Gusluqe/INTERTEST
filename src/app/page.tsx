'use client';

import { motion } from 'framer-motion';
import { SpeedTest } from '@/components/speed-test/speed-test';
import { NetworkInfo } from './network-info';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-gradient">Internet Speed Test</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade network diagnostics with precise measurements for 
              latency, jitter, download and upload speeds
            </p>
          </motion.div>

          <SpeedTest />
          
          <NetworkInfo />
        </div>
      </section>
    </div>
  );
}