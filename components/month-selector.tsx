"use client"

import type { MonthData } from "@/lib/transactions-data"
import { formatCurrency } from "@/lib/transactions-data"
import { Calendar, ChevronRight } from "lucide-react"

interface MonthSelectorProps {
  userName: string
  months: MonthData[]
  onSelect: (monthIndex: number) => void
}

export function MonthSelector({ userName, months, onSelect }: MonthSelectorProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="bg-gradient-to-br from-[oklch(0.38_0.18_270)] via-[oklch(0.35_0.20_265)] to-[oklch(0.30_0.15_250)] px-5 pb-10 pt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.98_0_0)]/15">
            <Calendar className="h-5 w-5 text-[oklch(0.95_0_0)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[oklch(0.98_0_0)]">Olá, {userName}</h1>
            <p className="text-sm text-[oklch(0.78_0.06_265)]">
              Selecione um mês para ver as transações
            </p>
          </div>
        </div>
      </div>

      <div className="-mt-4 flex flex-1 flex-col gap-3 rounded-t-2xl bg-background px-4 pb-8 pt-6">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Meses disponíveis
        </p>
        {months.map((month, index) => (
          <button
            key={`${month.year}-${month.month}`}
            onClick={() => onSelect(index)}
            className="group flex items-center gap-4 rounded-xl bg-card px-4 py-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-sm font-bold">
                {String(month.month).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start">
              <span className="text-sm font-semibold text-card-foreground">
                {month.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {month.transactions.length} transações • {formatCurrency(month.total)}
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  )
}
