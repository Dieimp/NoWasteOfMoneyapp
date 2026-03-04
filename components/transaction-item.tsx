"use client"

import { formatCurrency, type Transaction } from "@/lib/transactions-data"
import { ArrowDown, ArrowUp, X } from "lucide-react"

interface TransactionItemProps {
  transaction: Transaction
  onRemove: (id: string) => void
}

export function TransactionItem({ transaction, onRemove }: TransactionItemProps) {
  const isExpense = transaction.type === "expense"

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isExpense
            ? "bg-expense/10 text-expense"
            : "bg-income/10 text-income"
        }`}
      >
        {isExpense ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold text-card-foreground">
          {formatCurrency(transaction.amount)}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {transaction.date}
          {transaction.description && ` \u2022 ${transaction.description}`}
        </span>
      </div>

      <button
        onClick={() => onRemove(transaction.id)}
        className="shrink-0 rounded-full p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Remover transação de ${formatCurrency(transaction.amount)}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
