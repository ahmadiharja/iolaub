import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Debug: Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test if tables exist
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table';
    `;
    console.log('📊 Available tables:', tables);
    
    // Test User table
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
      console.log('👥 User count:', userCount);
    } catch (error) {
      console.log('❌ User table error:', error);
    }
    
    // Test Donation table  
    let donationCount = 0;
    try {
      donationCount = await prisma.donation.count();
      console.log('💰 Donation count:', donationCount);
    } catch (error) {
      console.log('❌ Donation table error:', error);
    }
    
    // Test ProjectConfig table
    let configCount = 0;
    try {
      configCount = await prisma.projectConfig.count();
      console.log('⚙️ Config count:', configCount);
    } catch (error) {
      console.log('❌ Config table error:', error);
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      tables: JSON.parse(JSON.stringify(tables, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )),
      counts: {
        users: userCount,
        donations: donationCount,
        configs: configCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      }
    });
    
  } catch (error) {
    console.error('💥 Debug error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code || 'UNKNOWN',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
