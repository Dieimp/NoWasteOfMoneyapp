"use client"

import { formatCurrency, type Transaction } from "@/lib/transactions-data"
import { ArrowDown, ArrowUp, X, Pencil } from "lucide-react"

interface TransactionItemProps {
  transaction: Transaction
  onRemove: (id: string) => void
  onEdit: (transaction: Transaction) => void
}

export function TransactionItem({ transaction, onRemove, onEdit }: TransactionItemProps) {
  const isExpense = transaction.type === "expense"

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors group"
      onClick={() => onEdit(transaction)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onEdit(transaction)
      }}
      aria-label={`Editar transação de ${formatCurrency(transaction.amount)}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isExpense
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

      <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 group-hover:text-primary/50 transition-colors" />

      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(transaction.id)
        }}
        className="shrink-0 rounded-full p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Remover transação de ${formatCurrency(transaction.amount)}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
