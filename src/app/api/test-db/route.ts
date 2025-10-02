import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		// Test basic database connection
		await prisma.$connect();
		
		// Test if we can query the database
		const result = await prisma.$queryRaw`SELECT 1 as test`;
		
		// Check what tables exist (SQLite version)
		const tables = await prisma.$queryRaw`
			SELECT name as table_name 
			FROM sqlite_master 
			WHERE type = 'table'
		`;
		
		return NextResponse.json({ 
			status: 'connected',
			message: 'Database connection successful',
			test_query: JSON.parse(JSON.stringify(result, (key, value) =>
				typeof value === 'bigint' ? value.toString() : value
			)),
			tables: JSON.parse(JSON.stringify(tables, (key, value) =>
				typeof value === 'bigint' ? value.toString() : value
			)),
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Database connection test failed:', error);
		
		return NextResponse.json({ 
			status: 'failed',
			message: 'Database connection failed',
			error: error instanceof Error ? error.message : 'Unknown error',
			code: (error as { code?: string })?.code || 'UNKNOWN',
			timestamp: new Date().toISOString()
		}, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
