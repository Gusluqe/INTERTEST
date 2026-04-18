import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    
    if (!contentLength) {
      return NextResponse.json(
        { error: 'Content-Length required' },
        { status: 400 }
      );
    }
    
    const size = parseInt(contentLength, 10);
    const maxSize = 10 * 1024 * 1024;
    
    if (size > maxSize) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      );
    }
    
    const chunks: Uint8Array[] = [];
    const reader = request.body?.getReader();
    
    if (reader) {
      let received = 0;
      // Note: Data is received but not decoded (just measuring size)
      
      while (received < size) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(new Uint8Array(value));
        received += value.length;
      }
    }
    
    const totalReceived = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    
    return NextResponse.json({
      status: 'ok',
      received: totalReceived,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload processing failed' },
      { status: 500 }
    );
  }
}