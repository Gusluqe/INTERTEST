'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Signal, Globe, MapPin, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NetworkInfoData {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export function NetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNetworkInfo = () => {
      const connection = (navigator as any).connection || 
                         (navigator as any).mozConnection || 
                         (navigator as any).webkitConnection;
      
      if (connection) {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      } else {
        setNetworkInfo({
          effectiveType: 'unknown',
        });
      }
      setLoading(false);
    };

    getNetworkInfo();

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', getNetworkInfo);
      return () => connection.removeEventListener('change', getNetworkInfo);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-12"
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Network Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem
                icon={<Signal className="h-4 w-4" />}
                label="Connection Type"
                value={networkInfo?.effectiveType || 'Unknown'}
              />
              <InfoItem
                icon={<Globe className="h-4 w-4" />}
                label="Max Bandwidth"
                value={networkInfo?.downlink ? `${networkInfo.downlink.toFixed(1)} Mbps` : '--'}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label="Latency (RTT)"
                value={networkInfo?.rtt ? `${networkInfo.rtt} ms` : '--'}
              />
              <InfoItem
                icon={<Server className="h-4 w-4" />}
                label="Data Saver"
                value={networkInfo?.saveData ? 'Enabled' : 'Disabled'}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}