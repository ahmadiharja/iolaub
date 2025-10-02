import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test environment variables
    const databaseUrl = process.env.DATABASE_URL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const nodeEnv = process.env.NODE_ENV;
    
    // Check if DATABASE_URL is Prisma Accelerate format
    const isPrismaAccelerate = databaseUrl?.includes('prisma-data.net');
    const isPostgres = databaseUrl?.startsWith('postgres://') || databaseUrl?.startsWith('postgresql://');
    const isPrismaFormat = databaseUrl?.startsWith('prisma+postgres://');
    
    return NextResponse.json({
      status: 'success',
      message: 'Environment check completed',
      environment: {
        nodeEnv,
        baseUrl,
        databaseUrl: databaseUrl ? `${databaseUrl.substring(0, 50)}...` : 'NOT_SET',
        databaseChecks: {
          isSet: !!databaseUrl,
          isPrismaAccelerate,
          isPostgres,
          isPrismaFormat,
          length: databaseUrl?.length || 0
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Environment check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
