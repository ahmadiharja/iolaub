import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not set'
      }, { status: 500 });
    }
    
    // Test direct HTTP request to Prisma Accelerate
    const response = await fetch('https://accelerate.prisma-data.net/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const healthCheck = await response.text();
    
    return NextResponse.json({
      status: 'success',
      message: 'Direct connection test completed',
      results: {
        accelerateHealth: response.status === 200 ? 'OK' : 'ERROR',
        healthResponse: healthCheck,
        databaseUrlSet: !!databaseUrl,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Direct connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
