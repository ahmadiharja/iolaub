"use client"

type DonationCardProps = {
  rank?: number
  amount?: string // formatted string e.g. "$1.000"
  orgName?: string
  refId?: string
  status?: "Confirmed" | "Pending" | "Failed"
  timestamp?: string // preformatted timestamp
  txHash?: string
  explorerLabel?: string
  txHashFull?: string // full transaction hash for the link
}

export function DonationCard({
  rank = 1,
  amount = "$1.000",
  orgName = "Vietnam Red Cross",
  refId = "REF001",
  status = "Confirmed",
  timestamp = "Oct 2, 2025, 09:24 PM",
  txHash = "test_tx_hash_001..._tx_hash_001",
  explorerLabel = "solscan",
  txHashFull = "",
}: DonationCardProps) {
  const handleExplorerClick = () => {
    if (txHashFull) {
      window.open(`https://solscan.io/tx/${txHashFull}`, '_blank');
    }
  };

  const statusConfig = {
    Confirmed: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
      border: "border-emerald-500/20"
    },
    Pending: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
      border: "border-amber-500/20"
    },
    Failed: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      dot: "bg-red-500",
      border: "border-red-500/20"
    }
  };

  const statusStyle = statusConfig[status];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border/50 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Left red accent */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 to-red-600"></div>
      
      {/* Rank badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
          #{rank}
        </div>
      </div>

      {/* Main content */}
      <div className="relative p-6 pl-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Amount */}
          <div className="text-center lg:text-left">
            <div className="relative">
              {/* Logo watermark */}
              <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <img 
                  src="/assets/logovrl.svg" 
                  alt="" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 group-hover:text-primary/90 transition-colors">
                {amount}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Donation Amount
              </div>
            </div>
          </div>

          {/* Center: Organization & Status */}
          <div className="space-y-4">
            {/* Organization */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                  {orgName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ref: {refId}
                </div>
              </div>
            </div>

            {/* Status & Date */}
            <div className="flex items-center gap-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                <div className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}></div>
                {status}
              </div>
              <div className="text-sm text-muted-foreground">
                {timestamp}
              </div>
            </div>
          </div>

          {/* Right: Transaction Hash & Action */}
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Transaction Hash
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/30 group-hover:bg-muted/50 transition-colors">
              <code className="font-mono text-foreground flex-1 truncate text-sm">
                {txHash}
              </code>
              <button
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:scale-105 active:scale-95"
                onClick={handleExplorerClick}
                aria-label={`Open in ${explorerLabel}`}
              >
                {explorerLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationCard
