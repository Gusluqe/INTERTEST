import { NextResponse } from 'next/server';

export async function GET() {
  const start = Date.now();
  
  await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
  
  const latency = Date.now() - start;
  
  return NextResponse.json({
    status: 'ok',
    timestamp: start,
    latency,
  });
}