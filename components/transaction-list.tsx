"use client"

import type { Transaction } from "@/lib/transactions-data"
import { TransactionItem } from "./transaction-item"

interface TransactionListProps {
  transactions: Transaction[]
  onRemove: (id: string) => void
}

export function TransactionList({ transactions, onRemove }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhuma transação encontrada neste mês.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-card">
      <h2 className="px-5 pb-2 pt-5 text-base font-semibold text-card-foreground">
        Transações
      </h2>
      <div className="divide-y divide-border">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}
