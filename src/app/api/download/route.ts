import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') || '1048576', 10);
  
  const safeSize = Math.min(Math.max(size, 1024), 10 * 1024 * 1024);
  
  const data = new Uint8Array(safeSize);
  for (let i = 0; i < safeSize; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  
  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': safeSize.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}