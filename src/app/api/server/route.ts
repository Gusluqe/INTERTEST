import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    server: {
      name: 'NetCheck Pro',
      location: 'Cloud Server',
      version: '1.0.0',
      uptime: process.uptime?.() || 0,
    },
    capabilities: {
      ping: true,
      download: true,
      upload: true,
    },
  });
}