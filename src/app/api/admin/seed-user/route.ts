import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST() {
	try {
		// Check if admin user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: 'bigbabol@admin.com' }
		});

		if (existingUser) {
			return NextResponse.json({ 
				message: 'Admin user already exists', 
				user: { email: existingUser.email, role: existingUser.role } 
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash('bigbabol0714!', 12);

		// Create admin user
		const user = await prisma.user.create({
			data: {
				email: 'bigbabol@admin.com',
				password: hashedPassword,
				role: 'admin'
			},
			select: { id: true, email: true, role: true, createdAt: true }
		});

		return NextResponse.json({ 
			message: 'Admin user created successfully', 
			user 
		});
	} catch (error) {
		console.error('Seed user error:', error);
		
		// If database is not available, provide fallback response
		if (error.code === 'P6001' || error.message.includes('URL must start with')) {
			return NextResponse.json({ 
				message: 'Database not available - using fallback authentication',
				fallback: true,
				credentials: {
					email: 'bigbabol@admin.com',
					password: 'bigbabol0714!'
				}
			});
		}
		
		return NextResponse.json({ 
			error: 'Failed to create admin user', 
			details: error.message 
		}, { status: 500 });
	}
}


