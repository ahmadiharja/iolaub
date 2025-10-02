import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch project configuration
export async function GET() {
  try {
    let config = await prisma.projectConfig.findFirst({
      orderBy: { created_at: 'desc' }
    });

    // If no config exists, create default one
    if (!config) {
      config = await prisma.projectConfig.create({
        data: {
          twitter_official: 'https://twitter.com/bualoi_official',
          twitter_community: 'https://twitter.com/bualoi_community', 
          pump_fun_address: 'https://pump.fun/coin/PLACEHOLDER',
          contract_address: '0x1234...ABCD',
          dexscreener_pair: 'PLACEHOLDERPAIR'
        }
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Config fetch error:', error);
    
    // Return default config if database fails
    return NextResponse.json({
      id: 'default',
      twitter_official: 'https://twitter.com/bualoi_official',
      twitter_community: 'https://twitter.com/bualoi_community',
      pump_fun_address: 'https://pump.fun/coin/PLACEHOLDER',
      contract_address: '0x1234...ABCD',
      dexscreener_pair: 'PLACEHOLDERPAIR',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
}

// POST - Create or update project configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      twitter_official,
      twitter_community,
      pump_fun_address,
      contract_address,
      dexscreener_pair
    } = body;

    // Check if config already exists
    const existingConfig = await prisma.projectConfig.findFirst();

    let config;
    if (existingConfig) {
      // Update existing config
      config = await prisma.projectConfig.update({
        where: { id: existingConfig.id },
        data: {
          twitter_official,
          twitter_community,
          pump_fun_address,
          contract_address,
          dexscreener_pair,
          updated_at: new Date()
        }
      });
    } else {
      // Create new config
      config = await prisma.projectConfig.create({
        data: {
          twitter_official,
          twitter_community,
          pump_fun_address,
          contract_address,
          dexscreener_pair
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Configuration updated successfully',
      config 
    });
  } catch (error) {
    console.error('Config update error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update configuration',
      details: error.message 
    }, { status: 500 });
  }
}
