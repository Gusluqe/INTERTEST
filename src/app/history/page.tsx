'use client';

import { motion } from 'framer-motion';
import { History as HistoryIcon } from '@/components/history/history-view';

export default function HistoryPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Test History</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            View and export your speed test results
          </p>
        </motion.div>

        <HistoryIcon />
      </div>
    </div>
  );
}