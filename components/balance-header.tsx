"use client"

import { formatCurrency } from "@/lib/transactions-data"
import { ArrowLeft } from "lucide-react"

interface BalanceHeaderProps {
  total: number
  monthLabel: string
  onBack: () => void
}

export function BalanceHeader({ total, monthLabel, onBack }: BalanceHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.38_0.18_270)] via-[oklch(0.35_0.20_265)] to-[oklch(0.30_0.15_250)] px-5 pb-8 pt-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[oklch(0.85_0.05_265)] transition-colors hover:text-[oklch(0.95_0_0)]"
        aria-label="Voltar para seletor de meses"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>{monthLabel}</span>
      </button>
      <p className="text-sm font-normal text-[oklch(0.78_0.06_265)]">
        Total que você possui
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.98_0_0)]">
        {formatCurrency(total)}
      </p>
    </div>
  )
}
