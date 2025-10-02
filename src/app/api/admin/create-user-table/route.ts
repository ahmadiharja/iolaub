import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
	try {
		// Try to create User table using raw SQL
		await prisma.$executeRaw`
			CREATE TABLE IF NOT EXISTS "User" (
				id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
				email TEXT UNIQUE NOT NULL,
				password TEXT NOT NULL,
				role TEXT DEFAULT 'admin',
				"createdAt" TIMESTAMP DEFAULT NOW(),
				"updatedAt" TIMESTAMP DEFAULT NOW()
			);
		`;

		// Create index on email
		await prisma.$executeRaw`
			CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
		`;

		return NextResponse.json({ 
			message: 'User table created successfully',
			success: true
		});
	} catch (error) {
		console.error('Create table error:', error);
		return NextResponse.json({ 
			error: 'Failed to create User table', 
			details: error.message,
			fallback: true
		}, { status: 500 });
	}
}
