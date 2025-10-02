import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	try {
		const userId = request.cookies.get('admin_auth')?.value;
		
		console.log('Auth check for userId:', userId);
		
		if (!userId) {
			console.log('❌ No admin_auth cookie found');
			return NextResponse.json({ ok: false }, { status: 401 });
		}

		// Find user in database
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true, role: true } // Exclude password
		});

		if (!user) {
			console.log('❌ User not found for userId:', userId);
			return NextResponse.json({ ok: false }, { status: 401 });
		}
		
		console.log('✅ Auth successful for user:', user.email);
		return NextResponse.json({ ok: true, user });

	} catch (error) {
		console.error('Auth check error:', error);
		return NextResponse.json({ ok: false }, { status: 401 });
	}
}

