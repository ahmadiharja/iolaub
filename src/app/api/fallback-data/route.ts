import { NextResponse } from 'next/server';

// Fallback data for when database is not available
const fallbackDonations = [
  {
    id: '1',
    amount: 2500,
    tx_hash: '5KJp7VK8gX4aTcMRYGWYjJ3qZjKpKqKpKqKpKqKpKqKp',
    bank_reference: 'REF001',
    recipient_org: 'Vietnam Red Cross',
    datetime: new Date().toISOString()
  },
  {
    id: '2', 
    amount: 1800,
    tx_hash: '8LMq9WL9hY6bTdNSYHXYkK4rZkLrLrLrLrLrLrLrLrLr',
    bank_reference: 'REF002',
    recipient_org: 'UNICEF Vietnam',
    datetime: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    amount: 3200,
    tx_hash: '3GHi5TH5fU3aRbKQWFWXiH2pYhHrHrHrHrHrHrHrHrHr',
    bank_reference: 'REF003',
    recipient_org: 'Local Relief Fund',
    datetime: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    amount: 950,
    tx_hash: '7NJk9PL2hX5cSdOTXGXZkJ4qZkMrMrMrMrMrMrMrMrMr',
    bank_reference: 'REF004',
    recipient_org: 'Emergency Response Team',
    datetime: new Date(Date.now() - 14400000).toISOString()
  }
];

const fallbackConfig = {
  id: 'fallback-config-1',
  twitter_official: 'https://twitter.com/bualoi_official',
  twitter_community: 'https://twitter.com/bualoi_community',
  pump_fun_address: 'https://pump.fun/coin/7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
  contract_address: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
  dexscreener_pair: 'SOL_7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  if (type === 'donations') {
    return NextResponse.json(fallbackDonations);
  }
  
  if (type === 'config') {
    return NextResponse.json(fallbackConfig);
  }
  
  return NextResponse.json({
    status: 'success',
    message: 'Fallback data service',
    available: {
      donations: `${request.url}?type=donations`,
      config: `${request.url}?type=config`
    },
    note: 'This is fallback data while database connection is being restored'
  });
}
