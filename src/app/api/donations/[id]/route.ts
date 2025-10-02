import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const UpdateSchema = z.object({
	status: z.enum(['Pending', 'Withdrawn', 'Sent']).optional(),
});

export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	const body = await request.json().catch(() => null);
	const parsed = UpdateSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const data = await prisma.donation.update({
		where: { id },
		data: { status: parsed.data.status },
	});
	return NextResponse.json(data);
}


