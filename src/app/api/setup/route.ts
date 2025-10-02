import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🚀 Setup: Starting database initialization...');
    
    // Run Prisma migrations to ensure tables exist
    console.log('📋 Running database push...');
    
    // Create admin user if doesn't exist
    let adminUser;
    try {
      adminUser = await prisma.user.findUnique({
        where: { email: 'bigbabol@admin.com' }
      });
      
      if (!adminUser) {
        console.log('👤 Creating admin user...');
        const hashedPassword = await bcrypt.hash('bigbabol0714!', 12);
        adminUser = await prisma.user.create({
          data: {
            email: 'bigbabol@admin.com',
            password: hashedPassword,
            role: 'admin'
          }
        });
        console.log('✅ Admin user created');
      } else {
        console.log('👤 Admin user already exists');
      }
    } catch (error) {
      console.log('❌ Admin user creation error:', error);
    }
    
    // Create default project config if doesn't exist
    let config;
    try {
      config = await prisma.projectConfig.findFirst();
      
      if (!config) {
        console.log('⚙️ Creating default project config...');
        config = await prisma.projectConfig.create({
          data: {
            twitter_official: 'https://twitter.com/bualoi_official',
            twitter_community: 'https://twitter.com/bualoi_community', 
            pump_fun_address: 'https://pump.fun/coin/PLACEHOLDER',
            contract_address: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
            dexscreener_pair: 'PLACEHOLDERPAIR'
          }
        });
        console.log('✅ Default config created');
      } else {
        console.log('⚙️ Project config already exists');
      }
    } catch (error) {
      console.log('❌ Config creation error:', error);
    }
    
    // Create sample donations if none exist
    try {
      const donationCount = await prisma.donation.count();
      
      if (donationCount === 0) {
        console.log('💰 Creating sample donations...');
        await prisma.donation.createMany({
          data: [
            {
              tx_hash: '5KJp7VK8gX4aTcMRYGWYjJ3qZjKpKqKpKqKpKqKpKqKp',
              from_wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
              to_wallet: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
              amount: 1500,
              datetime: new Date().toISOString(),
              bank_reference: 'REF001',
              recipient_org: 'Vietnam Red Cross',
              status: 'Sent'
            },
            {
              tx_hash: '8LMq9WL9hY6bTdNSYHXYkK4rZkLrLrLrLrLrLrLrLrLr',
              from_wallet: '4VfYkQwjwdQHx6xjwvQTHx6xjwvQTHx6xjwvQTHx6xjw',
              to_wallet: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
              amount: 2500,
              datetime: new Date(Date.now() - 86400000).toISOString(),
              bank_reference: 'REF002',
              recipient_org: 'UNICEF Vietnam',
              status: 'Sent'
            }
          ]
        });
        console.log('✅ Sample donations created');
      } else {
        console.log('💰 Donations already exist');
      }
    } catch (error) {
      console.log('❌ Donation creation error:', error);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      data: {
        adminUser: adminUser ? { id: adminUser.id, email: adminUser.email } : null,
        config: config ? { id: config.id } : null
      }
    });
    
  } catch (error) {
    console.error('💥 Setup error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
