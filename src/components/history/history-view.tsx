'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis,
  YAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Download, Upload, Activity, Trash2, Download as DownloadIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTestStore } from '@/store/test-store';
import { formatSpeed, formatLatency, formatDate } from '@/lib/utils';

export function History() {
  const { history, clearHistory } = useTestStore();
  const [selectedTab, setSelectedTab] = useState<'download' | 'upload' | 'ping'>('download');

  const handleExportJSON = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netcheck-pro-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = 'Date,Ping (ms),Jitter (ms),Download (Mbps),Upload (Mbps)\n';
    const rows = history.map(r => 
      `${formatDate(r.timestamp)},${r.ping.ping},${r.ping.jitter},${r.download.speed},${r.upload.speed}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netcheck-pro-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = history.map((r) => ({
    date: formatDate(r.timestamp),
    download: r.download.speed,
    upload: r.upload.speed,
    ping: r.ping.ping,
  })).reverse();

  const downloadData = chartData.map((d) => ({ date: d.date, value: d.download }));
  const uploadData = chartData.map((d) => ({ date: d.date, value: d.upload }));
  const pingData = chartData.map((d) => ({ date: d.date, value: d.ping }));

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4 opacity-20">📊</div>
            <h3 className="text-xl font-semibold mb-2">No Test History</h3>
            <p className="text-muted-foreground mb-6">
              Run your first speed test to see results here
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Test History</h1>
          <p className="text-muted-foreground">
            {history.length} test{history.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="destructive" size="sm" onClick={clearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {[
              { key: 'download', label: 'Download', icon: Download },
              { key: 'upload', label: 'Upload', icon: Upload },
              { key: 'ping', label: 'Ping', icon: Activity },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={selectedTab === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab(key as typeof selectedTab)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {selectedTab === 'download' ? (
                <AreaChart data={downloadData}>
                  <defs>
                    <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} unit=" Mbps" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#colorDownload)" 
                  />
                </AreaChart>
              ) : selectedTab === 'upload' ? (
                <AreaChart data={uploadData}>
                  <defs>
                    <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} unit=" Mbps" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#a855f7" 
                    fillOpacity={1} 
                    fill="url(#colorUpload)" 
                  />
                </AreaChart>
              ) : (
                <AreaChart data={pingData}>
                  <defs>
                    <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} unit=" ms" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#06b6d4" 
                    fillOpacity={1} 
                    fill="url(#colorPing)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Tests</h2>
        <div className="grid gap-4">
          <AnimatePresence>
            {history.slice(0, 10).map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(test.timestamp)}
                        </div>
                        <Badge variant="outline" className="hidden sm:flex">
                          {test.server.name}
                        </Badge>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-cyan-400" />
                          <span>{formatLatency(test.ping.ping)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-green-400" />
                          <span className="font-medium">{formatSpeed(test.download.speed)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4 text-purple-400" />
                          <span className="font-medium">{formatSpeed(test.upload.speed)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}