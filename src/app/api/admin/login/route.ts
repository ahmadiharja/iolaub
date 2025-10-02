import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();
		
		if (!email || !password) {
			return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
		}

		console.log('Login attempt:', { email, password: '***' });

		// Find user in database
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			console.log('❌ User not found:', email);
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password);
		
		if (!isValidPassword) {
			console.log('❌ Invalid password for:', email);
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Create user response (exclude password)
		const userResponse = {
			id: user.id,
			email: user.email,
			role: user.role
		};

		const res = NextResponse.json({ 
			ok: true, 
			user: userResponse,
			message: 'Login successful'
		});

		// Set auth cookie
		res.cookies.set('admin_auth', user.id, { 
			httpOnly: true, 
			sameSite: 'lax', 
			path: '/', 
			maxAge: 60 * 60 * 24 // 24 hours
		});
		
		console.log('✅ Login successful for:', email);
		return res;

	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ 
			error: 'Internal server error',
			details: error.message 
		}, { status: 500 });
	}
}

