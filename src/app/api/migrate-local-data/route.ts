import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🚀 Starting data migration to production database...');
    
    const prisma = new PrismaClient();
    
    // Create admin user
    console.log('👥 Creating admin user...');
    try {
      const hashedPassword = await bcrypt.hash('bigbabol0714!', 12);
      const adminUser = await prisma.user.upsert({
        where: { email: 'bigbabol@admin.com' },
        update: {
          password: hashedPassword,
          role: 'admin'
        },
        create: {
          email: 'bigbabol@admin.com',
          password: hashedPassword,
          role: 'admin'
        }
      });
      console.log('✅ Admin user created/updated');
    } catch (error) {
      console.log('⚠️ Admin user error:', error);
    }
    
    // Create project config
    console.log('⚙️ Creating project config...');
    try {
      const config = await prisma.projectConfig.upsert({
        where: { id: 'main-config' },
        update: {
          twitter_official: 'https://twitter.com/bualoi_official',
          twitter_community: 'https://twitter.com/bualoi_community',
          pump_fun_address: 'https://pump.fun/coin/7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
          contract_address: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
          dexscreener_pair: 'SOL_7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1'
        },
        create: {
          id: 'main-config',
          twitter_official: 'https://twitter.com/bualoi_official',
          twitter_community: 'https://twitter.com/bualoi_community',
          pump_fun_address: 'https://pump.fun/coin/7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
          contract_address: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
          dexscreener_pair: 'SOL_7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1'
        }
      });
      console.log('✅ Project config created/updated');
    } catch (error) {
      console.log('⚠️ Config error:', error);
    }
    
    // Create sample donations
    console.log('💰 Creating sample donations...');
    const sampleDonations = [
      {
        tx_hash: '5KJp7VK8gX4aTcMRYGWYjJ3qZjKpKqKpKqKpKqKpKqKp',
        from_wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        to_wallet: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
        amount: 2500,
        datetime: new Date().toISOString(),
        bank_reference: 'REF001',
        recipient_org: 'Vietnam Red Cross',
        status: 'Sent'
      },
      {
        tx_hash: '8LMq9WL9hY6bTdNSYHXYkK4rZkLrLrLrLrLrLrLrLrLr',
        from_wallet: '4VfYkQwjwdQHx6xjwvQTHx6xjwvQTHx6xjwvQTHx6xjw',
        to_wallet: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
        amount: 1800,
        datetime: new Date(Date.now() - 3600000).toISOString(),
        bank_reference: 'REF002',
        recipient_org: 'UNICEF Vietnam',
        status: 'Sent'
      },
      {
        tx_hash: '3GHi5TH5fU3aRbKQWFWXiH2pYhHrHrHrHrHrHrHrHrHr',
        from_wallet: '2TcHgVwjGL9GqrqtuvK1f9HFrEe5faUUXGdxuFjKiGSj',
        to_wallet: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
        amount: 3200,
        datetime: new Date(Date.now() - 7200000).toISOString(),
        bank_reference: 'REF003',
        recipient_org: 'Local Relief Fund',
        status: 'Sent'
      }
    ];
    
    for (const donation of sampleDonations) {
      try {
        await prisma.donation.upsert({
          where: { tx_hash: donation.tx_hash },
          update: donation,
          create: donation
        });
        console.log(`✅ Donation created: ${donation.tx_hash.substring(0, 8)}...`);
      } catch (error) {
        console.log(`⚠️ Donation error: ${donation.tx_hash.substring(0, 8)}...`);
      }
    }
    
    // Verify data
    const userCount = await prisma.user.count();
    const donationCount = await prisma.donation.count();
    const configCount = await prisma.projectConfig.count();
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Data migration completed successfully!',
      counts: {
        users: userCount,
        donations: donationCount,
        configs: configCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
