import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    // Check if DATABASE_URL format is correct
    if (!databaseUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not set'
      }, { status: 500 });
    }
    
    // Extract API key from URL
    const apiKeyMatch = databaseUrl.match(/api_key=([^&]+)/);
    const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;
    
    // Basic format validation
    const isValidFormat = databaseUrl.startsWith('prisma+postgres://accelerate.prisma-data.net');
    
    return NextResponse.json({
      status: 'info',
      message: 'Database URL analysis',
      checks: {
        isSet: !!databaseUrl,
        hasApiKey: !!apiKey,
        isValidFormat,
        urlLength: databaseUrl.length,
        apiKeyLength: apiKey ? apiKey.length : 0,
        urlPreview: databaseUrl.substring(0, 80) + '...',
        // Show first and last 10 chars of API key for verification
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 10)}` : null
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Analysis failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
