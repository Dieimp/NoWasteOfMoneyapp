"use client"

import { useState } from "react"
import type { MonthData } from "@/lib/transactions-data"
import { BalanceHeader } from "./balance-header"
import { TransactionList } from "./transaction-list"

interface TransactionsScreenProps {
  monthData: MonthData
  onBack: () => void
}

export function TransactionsScreen({ monthData, onBack }: TransactionsScreenProps) {
  const [transactions, setTransactions] = useState(monthData.transactions)

  function handleRemove(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <BalanceHeader
        total={monthData.total}
        monthLabel={monthData.label}
        onBack={onBack}
      />

      <div className="-mt-1 flex-1 rounded-t-2xl bg-card shadow-sm">
        <TransactionList transactions={transactions} onRemove={handleRemove} />
      </div>
    </div>
  )
}
