'use client';

import { motion } from 'framer-motion';
import { Activity, Download, Upload, Zap, Info, Shield, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-4">
            <span className="text-gradient">About NetCheck Pro</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Professional internet speed testing with precise metrics and premium UX
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Gauge className="h-6 w-6 text-primary" />}
            title="Precision Metrics"
            description="Accurate measurements for ping, jitter, download and upload speeds"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Privacy First"
            description="All tests run locally, no personal data is stored or transmitted"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Fast & Lightweight"
            description="Optimized for speed with minimal resource usage"
          />
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Understanding Your Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MetricExplanation
              icon={<Activity className="h-5 w-5 text-cyan-400" />}
              title="Ping (Latency)"
              description="The time it takes for data to travel from your device to the server and back. Lower is better. Essential for gaming and video calls."
              ideal="< 20ms"
            />
            <MetricExplanation
              icon={<Activity className="h-5 w-5 text-yellow-400" />}
              title="Jitter"
              description="Variation in ping time. High jitter can cause lag and disconnections in real-time applications."
              ideal="< 10ms"
            />
            <MetricExplanation
              icon={<Download className="h-5 w-5 text-green-400" />}
              title="Download Speed"
              description="How fast you can receive data from the internet. Important for streaming, downloading files, and browsing."
              ideal="> 50 Mbps"
            />
            <MetricExplanation
              icon={<Upload className="h-5 w-5 text-purple-400" />}
              title="Upload Speed"
              description="How fast you can send data to the internet. Important for video calls, cloud storage, and gaming streams."
              ideal="> 20 Mbps"
            />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Technical Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Browser-based speed tests have inherent limitations compared to dedicated software:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <span>Real speeds may be higher due to browser overhead and HTTP protocol limitations</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <span>Results may vary based on browser, device, and network configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <span>Some networks may throttle or prioritize certain types of traffic</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <span>Multiple tests are recommended for more accurate results</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>NetCheck Pro v1.0.0 &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
      <Card className="glass hover:border-primary/30 transition-colors h-full">
        <CardContent className="p-6">
          <div className="mb-4">{icon}</div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MetricExplanation({ 
  icon, 
  title, 
  description, 
  ideal 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  ideal: string; 
}) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-secondary/30">
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium">{title}</h4>
          <Badge variant="success">Ideal: {ideal}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}