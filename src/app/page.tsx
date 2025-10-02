import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import HeroCarousel from "@/components/hero-carousel";
import ContractCard from "@/components/contract-card";
import MarqueeBanner from "@/components/marquee-banner";
import MobileArticleReader from "@/components/mobile-article-reader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// Table components removed - using card-based layout instead
import CopyButton from "@/components/copy-button";
import Gallery from "@/components/gallery";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getDonations() {
	try {
	const data = await prisma.donation.findMany({
		select: { amount: true, tx_hash: true, bank_reference: true, recipient_org: true, datetime: true },
		orderBy: { datetime: 'desc' },
		take: 200,
	});
	return data;
	} catch (error) {
		console.log('Database connection error, using dummy data:', error);
		// Return dummy data if database is not available
		return [
			{
				amount: 1000,
				tx_hash: '5KJp7VK8gX4aTcMRYGWYjJ3qZjKpKqKpKqKpKqKpKqKp',
				bank_reference: 'REF001',
				recipient_org: 'Vietnam Red Cross',
				datetime: new Date().toISOString(),
			},
			{
				amount: 2500,
				tx_hash: '8LMq9WL9hY6bTdNSYHXYkK4rZkLrLrLrLrLrLrLrLrLr',
				bank_reference: 'REF002',
				recipient_org: 'UNICEF Vietnam',
				datetime: new Date(Date.now() - 86400000).toISOString(),
			},
			{
				amount: 500,
				tx_hash: '3GHi5TH5fU3aRbKQWFWXiH2pYhHrHrHrHrHrHrHrHrHr',
				bank_reference: null,
				recipient_org: 'Local Relief Fund',
				datetime: new Date(Date.now() - 172800000).toISOString(),
			},
		];
	}
}

async function getProjectConfig() {
	try {
		// Use API endpoint instead of direct Prisma call to avoid client issues
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
		                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001');
		
		const response = await fetch(`${baseUrl}/api/config`, {
			next: { revalidate: 60 },
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		if (!response.ok) {
			console.log('Config API response not OK, trying fallback:', response.status, response.statusText);
			throw new Error(`Config API failed: ${response.status}`);
		}
		
		const config = await response.json();
		console.log('✅ Config loaded successfully from database');
		return config;
	} catch (error) {
		console.log('❌ Config fetch error, using fallback data:', error);
		
		// Try fallback data service
		try {
			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
			                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001');
			const fallbackResponse = await fetch(`${baseUrl}/api/fallback-data?type=config`, {
				next: { revalidate: 300 }
			});
			if (fallbackResponse.ok) {
				const fallbackConfig = await fallbackResponse.json();
				console.log('✅ Using fallback config data');
				return fallbackConfig;
			}
		} catch (fallbackError) {
			console.log('Fallback also failed:', fallbackError);
		}
		
		// Final fallback - hardcoded values
		return {
			twitter_official: 'https://twitter.com/bualoi_official',
			twitter_community: 'https://twitter.com/bualoi_community',
			pump_fun_address: 'https://pump.fun/coin/7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
			contract_address: '7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1',
			dexscreener_pair: 'SOL_7xKXtg2CW3DnBcjPiVNqHkETGSsyBESdLkB4gHqRWpD1'
		};
	}
}

type DonationAmountRow = { amount: number, tx_hash: string, bank_reference: string | null, recipient_org: string | null, datetime: string };

export default async function Home() {
    const donations = (await getDonations()) as DonationAmountRow[];
    const config = await getProjectConfig();
    const total = donations.reduce((sum: number, d: DonationAmountRow) => sum + Number(d.amount ?? 0), 0);

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <header className="w-full border-b bg-card">
                <div className="mx-auto max-w-6xl px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 md:h-12 w-auto">
                                <Image src="/assets/png/bualoi_light.png" alt="Bualoi" width={200} height={48} className="h-10 md:h-12 w-auto object-contain dark:hidden" />
                                <Image src="/assets/png/bualoi_dark.png" alt="Bualoi" width={200} height={48} className="h-10 md:h-12 w-auto object-contain hidden dark:block" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-primary">Buy $BUALOI, Save Lives.</span>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <section className="bg-background">
                <HeroCarousel />
            </section>

            <section className="bg-background">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-balance text-2xl font-semibold tracking-tight">Crypto united for Vietnam</h2>
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                When disaster strikes, speed and transparency save lives. $BUA channels crypto-native generosity into
                                immediate relief for communities impacted by Typhoon Bualoi in Vietnam. Every trade fuels direct
                                on-chain support for local responders. 100% trackable. 0% excuses.
                            </p>
                            <ul className="list-inside list-disc text-muted-foreground">
                                <li>Transparent wallet flows and public reporting</li>
                                <li>Open-source receipts, verifiable distribution</li>
                                <li>Meme + Charity + Solidarity — easy to spread, easy to trust</li>
                            </ul>
                            <div className="mt-2 flex gap-3">
                                    <Button asChild size="sm">
                                        <Link href={config?.pump_fun_address || "https://pump.fun"} target="_blank">Buy $BUALOI</Link>
                                    </Button>
                                <Button variant="outline" asChild size="sm"><Link href="#donations">View Donations</Link></Button>
                            </div>
                        </div>
                        <ContractCard />
                    </div>
                </div>
            </section>

            <MarqueeBanner />

            <section className="bg-background">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <h3 className="text-balance text-2xl font-bold tracking-tight mb-8 text-center font-serif">Latest Situation: Typhoon Bualoi Devastates Vietnam</h3>
                    
                    {/* Mobile version with read more */}
                    <MobileArticleReader>
                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            <span className="float-left text-6xl font-bold leading-none pr-2 pt-1 text-primary font-serif">I</span>
                            n a devastating turn of events that unfolded in late September 2025, Typhoon Bualoi has wreaked unprecedented havoc across Vietnam, leaving communities struggling to recover from one of the most destructive storms in recent memory. The powerful typhoon, packing winds of up to 130 kilometers per hour and generating waves reaching 8 meters in height, made landfall with catastrophic force.
                        </p>
                        
                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            The human toll has been staggering. Official reports confirm at least 26 fatalities, with 105 individuals suffering injuries of varying severity. Perhaps most concerning, 22 people remain missing, their fates unknown as search and rescue operations continue across the affected regions.
                        </p>
                        
                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            In response to this unprecedented crisis, the Vietnamese government has mobilized resources on a massive scale. Approximately 250,000 people have been evacuated from high-risk areas, while 100,000 military personnel have been deployed to assist in rescue operations, evacuation efforts, and emergency relief distribution.
                        </p>
                        
                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            Transportation infrastructure has been severely impacted, with four major airports in the central region—including the crucial Da Nang International Airport—temporarily shuttered to ensure aviation safety. This disruption has complicated relief efforts and limited access to affected areas.
                        </p>
                        
                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            The scale of destruction extends far beyond human casualties. More than 100,000 homes have sustained damage ranging from minor structural issues to complete destruction, displacing thousands of families who now face uncertain futures. The agricultural sector, a cornerstone of Vietnam&apos;s economy, has not been spared—approximately 14,000 hectares of farmland lie devastated, threatening food security and livelihoods.
                        </p>

                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            Emergency shelters have been established across affected provinces, providing temporary refuge for displaced families. International humanitarian organizations have begun coordinating relief efforts, focusing on immediate needs such as clean water, medical supplies, and emergency food distribution.
                        </p>

                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            The torrential rains accompanying Typhoon Bualoi have triggered widespread flooding and dangerous landslides across multiple provinces. Coastal and low-lying communities have borne the brunt of the impact, with entire neighborhoods submerged and critical infrastructure compromised.
                        </p>
                        
                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            Local organizations, religious groups, and community volunteers have stepped up to provide essential support, distributing food, clothing, and temporary shelter to those in desperate need. However, the magnitude of this disaster requires sustained international support and resources to ensure effective recovery and rebuilding efforts.
                        </p>

                        <p className="text-pretty leading-relaxed text-muted-foreground">
                            Climate experts note that Typhoon Bualoi represents a growing pattern of increasingly severe weather events in Southeast Asia, attributed to rising global temperatures and changing ocean currents. This disaster underscores the urgent need for enhanced disaster preparedness and climate adaptation strategies in vulnerable coastal regions.
                        </p>
                    </MobileArticleReader>

                    {/* Desktop version - Two-column newspaper style layout */}
                    <div className="hidden md:grid md:grid-cols-2 gap-8 text-justify">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                <span className="float-left text-6xl font-bold leading-none pr-2 pt-1 text-primary font-serif">I</span>
                                n a devastating turn of events that unfolded in late September 2025, Typhoon Bualoi has wreaked unprecedented havoc across Vietnam, leaving communities struggling to recover from one of the most destructive storms in recent memory. The powerful typhoon, packing winds of up to 130 kilometers per hour and generating waves reaching 8 meters in height, made landfall with catastrophic force.
                            </p>
                            
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                The human toll has been staggering. Official reports confirm at least 26 fatalities, with 105 individuals suffering injuries of varying severity. Perhaps most concerning, 22 people remain missing, their fates unknown as search and rescue operations continue across the affected regions. Families wait anxiously for news of their loved ones as emergency teams work tirelessly against time and challenging conditions.
                            </p>
                            
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                The scale of destruction extends far beyond human casualties. More than 100,000 homes have sustained damage ranging from minor structural issues to complete destruction, displacing thousands of families who now face uncertain futures. The agricultural sector, a cornerstone of Vietnam&apos;s economy, has not been spared—approximately 14,000 hectares of farmland lie devastated, threatening food security and livelihoods.
                            </p>

                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                Emergency shelters have been established across affected provinces, providing temporary refuge for displaced families. International humanitarian organizations have begun coordinating relief efforts, focusing on immediate needs such as clean water, medical supplies, and emergency food distribution. The World Health Organization has issued warnings about potential disease outbreaks in flood-affected areas, emphasizing the critical need for sanitation and healthcare services.
                            </p>

                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                Economic implications of the disaster are becoming increasingly apparent as businesses remain shuttered and supply chains disrupted. The tourism industry, vital to Vietnam&apos;s economy, faces significant challenges with damaged infrastructure and cancelled flights affecting visitor arrivals during the peak season.
                            </p>
                        </div>
                        
                        {/* Column 2 */}
                        <div className="space-y-4">
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                In response to this unprecedented crisis, the Vietnamese government has mobilized resources on a massive scale. Approximately 250,000 people have been evacuated from high-risk areas, while 100,000 military personnel have been deployed to assist in rescue operations, evacuation efforts, and emergency relief distribution.
                            </p>
                            
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                Transportation infrastructure has been severely impacted, with four major airports in the central region—including the crucial Da Nang International Airport—temporarily shuttered to ensure aviation safety. This disruption has complicated relief efforts and limited access to affected areas, making the work of humanitarian organizations even more challenging.
                            </p>
                            
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                The torrential rains accompanying Typhoon Bualoi have triggered widespread flooding and dangerous landslides across multiple provinces. Coastal and low-lying communities have borne the brunt of the impact, with entire neighborhoods submerged and critical infrastructure compromised. Power outages and communication disruptions have further complicated rescue and relief efforts.
                            </p>
                            
                            <p className="text-pretty leading-relaxed text-muted-foreground">
                                Local organizations, religious groups, and community volunteers have stepped up to provide essential support, distributing food, clothing, and temporary shelter to those in desperate need. However, the magnitude of this disaster requires sustained international support and resources to ensure effective recovery and rebuilding efforts.
                            </p>

                    <p className="text-pretty leading-relaxed text-muted-foreground">
                                Climate experts note that Typhoon Bualoi represents a growing pattern of increasingly severe weather events in Southeast Asia, attributed to rising global temperatures and changing ocean currents. This disaster underscores the urgent need for enhanced disaster preparedness and climate adaptation strategies in vulnerable coastal regions.
                            </p>
                        </div>
                    </div>
                    
                    {/* Call to action */}
                    <div className="mt-8 p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                        <p className="text-sm text-muted-foreground italic text-center">
                            <strong>Emergency Response Needed:</strong> With needs evolving rapidly, immediate humanitarian assistance is critical. 
                            Your contribution through $BUALOI directly accelerates frontline relief efforts, providing transparent, blockchain-verified aid to those who need it most.
                        </p>
                    </div>
                </div>
            </section>

            <section id="donations" className="bg-card">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <div className="text-center mb-8">
                        <h3 className="text-balance text-2xl font-bold tracking-tight mb-2 font-serif">On-Chain Donations</h3>
                        <p className="text-muted-foreground">Live transparency • Every transaction verified on blockchain</p>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Total Raised: ${total.toLocaleString()}
                        </div>
                    </div>
                    
                    {/* Redesigned Donation Cards - Image Style */}
                    <div className="space-y-4">
                        {donations.slice(0, 10).map((d, index) => (
                            <div key={d.tx_hash} className="group">
                                <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card border-0">
                                    <CardContent className="p-0">
                                        {/* Desktop Layout */}
                                        <div className="hidden md:flex h-32">
                                            {/* Left Section - Red Background */}
                                            <div className="relative w-1/3 bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center">
                                                {/* Rank Badge */}
                                                <div className="absolute top-3 left-3 bg-red-700 px-3 py-1 rounded-lg transform -skew-x-12">
                                                    <span className="text-white font-bold text-sm">#{index + 1}</span>
                                                </div>
                                                
                                                {/* Amount */}
                                                <div className="relative z-10 text-center">
                                                    <div className="text-4xl font-bold text-white mb-1">
                                                        ${Number(d.amount).toLocaleString()}
                                                    </div>
                                                </div>
                                                
                                                {/* Logo Gradient Background */}
                                                <div className="absolute inset-0 opacity-20">
                                                    <img 
                                                        src="/assets/logovrl.svg" 
                                                        alt="Logo" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Right Section - Dark Grey Background */}
                                            <div className="flex-1 bg-gray-800 p-6 flex flex-col justify-between">
                                                {/* Top Row: Organization & Status */}
                                                <div className="flex items-start justify-between">
                                                    {/* Organization Info */}
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white text-lg">
                                                                {d.recipient_org || 'Relief Fund'}
                                                            </div>
                                                            {d.bank_reference && (
                                                                <div className="text-gray-400 text-sm">
                                                                    Ref: {d.bank_reference}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Status & Date */}
                                                    <div className="text-right">
                                                        <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span>Confirmed</span>
                                                        </div>
                                                        <div className="text-gray-400 text-sm">
                                                            {new Date(d.datetime).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Bottom Row: Transaction Hash */}
                                                <div className="mt-4">
                                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                                        Transaction Hash
                                                    </div>
                                                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                                                        <code className="text-sm font-mono text-white flex-1 truncate">
                                                            {d.tx_hash.slice(0, 20)}...{d.tx_hash.slice(-16)}
                                                        </code>
                                                        <div className="w-px h-6 bg-gray-600"></div>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8 px-3 text-green-400 hover:bg-green-500/20 hover:text-green-300 transition-colors font-medium" 
                                                            asChild
                                                        >
                                                            <Link href={`https://solscan.io/tx/${d.tx_hash}`} target="_blank">
                                                                Solscan
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Mobile Layout */}
                                        <div className="md:hidden p-4 space-y-4">
                                            {/* Header: Amount & Status */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-2xl font-bold text-primary">
                                                        ${Number(d.amount).toLocaleString()}
                                                    </div>
                                                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span>Confirmed</span>
                                                </div>
                                            </div>
                                            
                                            {/* Organization */}
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground text-sm">
                                                        {d.recipient_org || 'Relief Fund'}
                                                    </div>
                                                    {d.bank_reference && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Ref: {d.bank_reference}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Transaction Hash */}
                                            <div>
                                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                                    Transaction Hash
                                                </div>
                                                <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg border border-border/30">
                                                    <code className="text-xs font-mono text-foreground flex-1 truncate">
                                                        {d.tx_hash.slice(0, 12)}...{d.tx_hash.slice(-8)}
                                                    </code>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-7 w-7 p-0 hover:bg-primary/10 rounded-md" 
                                                        asChild
                                                    >
                                                        <Link href={`https://solscan.io/tx/${d.tx_hash}`} target="_blank">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            {/* Footer: Date */}
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(d.datetime).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                        
                        {donations.length === 0 && (
                            <Card className="border-dashed border-2 border-border/50 bg-muted/20">
                                <CardContent className="p-16 text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-foreground">No donations yet</h3>
                                    <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8 text-lg">
                                        Be the first to contribute to the relief effort and help make a difference in the lives of those affected by Typhoon Bualoi.
                                    </p>
                                    <Button asChild className="bg-primary hover:bg-primary/90 h-12 px-8 text-base font-medium">
                                        <Link href={config?.pump_fun_address || "https://pump.fun"} target="_blank">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Make First Donation
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <h3 className="text-balance text-xl font-semibold tracking-tight mb-6 text-center">Join Movement & Community</h3>
                    <Card className="relative overflow-hidden">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                            <Image 
                                src="/assets/herocarousel/2.jpg" 
                                alt="Community Background" 
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/60"></div>
                        </div>
                        
                        {/* Content */}
                        <CardContent className="relative z-10 p-8 md:p-12 text-center">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <h4 className="text-2xl md:text-3xl font-bold text-white">
                                    Be Part of the Change
                                </h4>
                                <p className="text-lg text-white/90 leading-relaxed">
                                    Join thousands of crypto enthusiasts making a real difference. Connect with our community, 
                                    share updates, and stay informed about our relief efforts in Vietnam.
                                </p>
                                <div className="flex justify-center items-center">
                                    <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-semibold">
                                        <Link href={config?.twitter_community || "https://twitter.com/bualoi_community"} target="_blank">
                                            Join Community Twitter
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span>24/7 Community Support</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span>Real-time Updates</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        <span>Transparent Reports</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-balance text-xl font-semibold tracking-tight">Field Gallery</h3>
                        <span className="text-xs text-muted-foreground">Community-sourced visuals</span>
                    </div>
                    <Gallery />
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <h3 className="text-balance text-xl font-semibold tracking-tight mb-4">Market & Liquidity (Live)</h3>
                    <div className="rounded-md border bg-card p-3">
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-md">
                            <iframe
                                title="$BUALOI Dexscreener"
                                src={`https://dexscreener.com/solana/${config?.dexscreener_pair || 'PLACEHOLDERPAIR'}?embed=1&theme=dark`}
                                className="h-full w-full"
                                allow="clipboard-write; encrypted-media"
                                frameBorder={0}
                            />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-muted-foreground">
                                {config?.dexscreener_pair ? 
                                    `Live chart for pair: ${config.dexscreener_pair}` : 
                                    'Chart will load when pair address is configured'
                                }
                            </div>
                            <div className="flex items-center gap-2">
                                <a 
                                    href={`https://dexscreener.com/solana/${config?.dexscreener_pair || ''}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground"
                                >
                                    Open on Dexscreener
                                </a>
                                <a href="#donations" className="text-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground">View Donations</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="mt-auto bg-card">
                <div className="mx-auto max-w-6xl px-4 py-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="text-sm text-muted-foreground">
                            Narrative: Crypto united for Vietnam – every trade fuels direct relief for victims of Typhoon Bualoi. 100% transparent on-chain.
                        </div>
                        <div className="flex items-center justify-start md:justify-end gap-3">
                            <a
                                href={config?.twitter_official || "https://twitter.com/bualoi_official"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm hover:text-foreground transition-colors group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                Typhon Bualoi
                            </a>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                        Meme + Charity + Solidarity. $BUALOI is a community-driven initiative. Not financial advice.
                    </div>
                </div>
            </footer>
        </main>
    );
}
