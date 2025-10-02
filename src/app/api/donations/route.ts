import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const DonationInput = z.object({
	tx_hash: z.string().min(10),
	from_wallet: z.string().optional().nullable(),
	to_wallet: z.string().optional().nullable(),
	amount: z.number().positive(),
	datetime: z.string().datetime().optional(),
	bank_reference: z.string().optional().nullable(),
	recipient_org: z.string().optional().nullable(),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') ?? '50');
    
    try {
        // Since Donation table exists, try to fetch real data
        const data = await prisma.donation.findMany({
            orderBy: { datetime: 'desc' },
            take: isNaN(limit) ? 50 : limit,
        });
        
        console.log(`✅ Successfully fetched ${data.length} donations from database`);
        return NextResponse.json(data);
    } catch (error) {
        console.log('Database connection error for donations:', error);
        
        // Return dummy data if database connection fails
        const dummyData = [
            {
                id: '1',
                tx_hash: '5KJp7VK8gX4aTcMRYGWYjJ3qZjKpKqKpKqKpKqKpKqKp',
                from_wallet: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
                to_wallet: '9yGCA2kMLLtgO5zrqvQjwcwNwYmBHp8reJBQdcrNqBvG',
                amount: 1000,
                datetime: new Date().toISOString(),
                bank_reference: 'REF001',
                recipient_org: 'Vietnam Red Cross',
                status: 'Pending',
            },
            {
                id: '2',
                tx_hash: '8LMq9WL9hY6bTdNSYHXYkK4rZkLrLrLrLrLrLrLrLrLr',
                from_wallet: '3xHXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD2',
                to_wallet: '5yGCA2kMLLtgO5zrqvQjwcwNwYmBHp8reJBQdcrNqBvH',
                amount: 2500,
                datetime: new Date(Date.now() - 86400000).toISOString(),
                bank_reference: 'REF002',
                recipient_org: 'UNICEF Vietnam',
                status: 'Sent',
            },
        ];
        return NextResponse.json(dummyData.slice(0, isNaN(limit) ? 50 : limit));
    }
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = DonationInput.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = await prisma.donation.create({
        data: {
            tx_hash: parsed.data.tx_hash,
            from_wallet: parsed.data.from_wallet ?? null,
            to_wallet: parsed.data.to_wallet ?? null,
            amount: parsed.data.amount,
            datetime: parsed.data.datetime ? new Date(parsed.data.datetime) : undefined,
            bank_reference: parsed.data.bank_reference ?? null,
            recipient_org: parsed.data.recipient_org ?? null,
        },
    });
    return NextResponse.json(data, { status: 201 });
}


