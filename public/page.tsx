import HeroCarousel from "@/components/hero-carousel"
import ContractCard from "@/components/contract-card"
import DonationTable from "@/components/donation-table"
import Gallery from "@/components/gallery"
import { ThemeToggle } from "@/components/theme-toggle"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Page() {
  return (
    <main className="flex flex-col">
      <header className="w-full border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="h-8 w-8 rounded-md bg-primary" title="$BUALOI mark" />
              <div>
                <h1 className="text-pretty text-lg font-semibold tracking-tight">Bualoi Relief Fund</h1>
                <p className="text-sm text-muted-foreground">Ticker: $BUALOI</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary">Buy $BUALOI, Save Lives.</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <section>
        <HeroCarousel />
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-balance text-2xl font-semibold tracking-tight">Crypto united for Vietnam</h2>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                When disaster strikes, speed and transparency save lives. $BUALOI channels crypto-native generosity into
                immediate relief for communities impacted by Typhoon Bualoi in Vietnam. Every trade fuels direct
                on-chain support for local responders. 100% trackable. 0% excuses.
              </p>
              <ul className="list-inside list-disc text-muted-foreground">
                <li>Transparent wallet flows and public reporting</li>
                <li>Open-source receipts, verifiable distribution</li>
                <li>Meme + Charity + Solidarity — easy to spread, easy to trust</li>
              </ul>
            </div>
            <ContractCard />
          </div>
        </div>
      </section>

      <section className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h3 className="text-balance text-xl font-semibold tracking-tight mb-4">
            Latest Situation: Typhoon Bualoi in Vietnam
          </h3>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            In recent days, heavy winds and torrential rain associated with Typhoon Bualoi have caused severe flooding,
            disrupted transport, and impacted power and communications across coastal and low-lying communities.
            Humanitarian teams are prioritizing evacuations, safe shelter, clean water, and medical support. Needs are
            evolving quickly—your contribution accelerates frontline relief and recovery.
          </p>
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h3 className="text-balance text-xl font-semibold tracking-tight mb-4">On-Chain Donations (Live Sample)</h3>
          <DonationTable />
        </div>
      </section>

      <section className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h3 className="text-balance text-xl font-semibold tracking-tight mb-4">Market & Liquidity (Live)</h3>
          <div className="rounded-md border bg-card p-3">
            <AspectRatio ratio={16 / 9}>
              <iframe
                title="$BUALOI Dexscreener"
                src={"https://dexscreener.com/solana/PLACEHOLDERPAIR?embed=1&theme=dark"}
                className="h-full w-full rounded-md"
                allow="clipboard-write; encrypted-media"
                frameBorder={0}
              />
            </AspectRatio>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Replace PLACEHOLDERPAIR with your live pair address on Dexscreener to load the chart.
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://dexscreener.com/solana"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground"
                >
                  Open on Dexscreener
                </a>
                <a
                  href="#donations"
                  className="text-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground"
                >
                  View Donations
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-balance text-xl font-semibold tracking-tight">Field Gallery</h3>
            <span className="text-xs text-muted-foreground">Community-sourced visuals</span>
          </div>
          <Gallery />
        </div>
      </section>

      <footer className="mt-auto border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-sm text-muted-foreground">
              Narrative: Crypto united for Vietnam – every trade fuels direct relief for victims of Typhoon Bualoi. 100%
              transparent on-chain.
            </div>
            <div className="flex items-center justify-start md:justify-end gap-3">
              <a
                href="#"
                className="text-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground"
              >
                Transparency Report (Soon)
              </a>
              <a
                href="#"
                className="text-sm underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground"
              >
                Open-Source Docs (Soon)
              </a>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Meme + Charity + Solidarity. $BUALOI is a community-driven initiative. Not financial advice.
          </div>
        </div>
      </footer>
    </main>
  )
}
