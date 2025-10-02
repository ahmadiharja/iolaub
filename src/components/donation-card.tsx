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
  const statusColorClass =
    status === "Confirmed"
      ? "bg-[color:var(--success-700)] text-[color:var(--primary-foreground)]"
      : status === "Pending"
        ? "bg-[color:var(--warning-600)] text-[color:var(--primary-foreground)]"
        : "bg-[color:var(--destructive-600)] text-[color:var(--primary-foreground)]"

  return (
    <article
      role="region"
      aria-label="Donation summary"
      className="relative w-full overflow-hidden rounded-[24px] bg-[var(--card)] text-[var(--card-foreground)] shadow"
    >
      {/* Left red ribbon with notch */}
      <div className="absolute inset-y-0 left-0 w-[86px]">
        <svg className="h-full w-full" viewBox="0 0 86 300" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="
              M0,24
              C0,10.745 10.745,0 24,0
              H86
              V120
              L60,134
              V300
              H24
              C10.745,300 0,289.255 0,276
              Z
            "
            fill="var(--brand-red)"
          />
        </svg>

        <div
          className="pointer-events-none absolute left-0 top-0 flex h-full w-[86px] items-start justify-center pt-7"
          aria-hidden="true"
        >
          <span className="text-[color:var(--primary-foreground)] text-2xl font-bold">#{rank}</span>
        </div>
      </div>

      {/* Watermark logo behind amount */}
      <img
        src="/assets/logovrl.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[112px] top-0 h-full w-auto opacity-[0.18] select-none"
        style={{ mixBlendMode: "normal" }}
      />

      {/* Main content layout */}
      <div className="relative grid grid-cols-1 gap-6 px-6 py-6 pl-[120px] md:grid-cols-[1fr,1.2fr] md:items-center md:gap-8 md:px-8 md:py-8 md:pl-[136px]">
        {/* Amount on the left */}
        <div className="flex items-center">
          <p className="text-[color:var(--primary-foreground)] text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            {amount}
          </p>
        </div>

        {/* Right details */}
        <div className="flex flex-col gap-7">
          {/* Top row: org + status + timestamp */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Rounded square icon with building */}
              <div className="rounded-[14px] bg-[color:var(--muted)]/10 p-2">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="text-[color:var(--muted-foreground)]"
                >
                  <path
                    fill="currentColor"
                    d="M4 20h16v-2H4v2Zm2-4h12V5a1 1 0 0 0-1-1h-3V3h-2v1H9a1 1 0 0 0-1 1v11Zm2-2V6h8v8H8Zm2-2h2V8h-2v4Zm3 0h2V8h-2v4Zm-6 7h2v-2H7v2Zm8 0h2v-2h-2v2Z"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-[color:var(--primary-foreground)] text-base font-semibold">{orgName}</div>
                <div className="text-[color:var(--muted-foreground)] text-sm">Ref: {refId}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status pill */}
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusColorClass}`}
                aria-label={`Status: ${status}`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--success-400)]" />
                {status}
              </span>

              {/* Timestamp */}
              <time className="text-[color:var(--muted-foreground)] text-sm" title={timestamp}>
                {timestamp}
              </time>
            </div>
          </div>

          {/* Transaction hash + explorer button */}
          <div className="flex items-center">
            <div className="flex w-full overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/5">
              <div className="flex-1 px-6 py-3">
                <code className="font-mono text-[color:var(--primary-foreground)]/90 text-base italic">{txHash}</code>
              </div>
              <button
                type="button"
                className="min-w-[140px] bg-[color:var(--success-700)] px-6 py-3 text-right text-lg font-semibold text-[color:var(--primary-foreground)] hover:bg-[color:var(--success-600)] focus:outline-none"
                onClick={handleExplorerClick}
                aria-label={`Open in ${explorerLabel}`}
              >
                {explorerLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default DonationCard
