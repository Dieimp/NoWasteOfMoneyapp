"use client"

import { useState } from "react"
import type { MonthData, Transaction } from "@/lib/transactions-data"
import { BalanceHeader } from "./balance-header"
import { TransactionList } from "./transaction-list"
import { NewMovementModal } from "./new-movement-modal"
import { Plus } from "lucide-react"

interface TransactionsScreenProps {
  monthData: MonthData
  personId: string | null
  onBack: () => void
  onRefresh: () => void
}

export function TransactionsScreen({ monthData, personId, onBack, onRefresh }: TransactionsScreenProps) {
  const [transactions, setTransactions] = useState(monthData.transactions)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function handleRemove(id: string) {
    try {
      const response = await fetch(`/api/month-movements/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        alert(errorData?.error || "Erro ao remover movimentação. Tente novamente.")
        return
      }

      setTransactions((prev: Transaction[]) => prev.filter((t) => t.id !== id))
      onRefresh()
    } catch (error) {
      console.error("Erro ao remover movimentação:", error)
      alert("Erro ao remover movimentação. Verifique sua conexão e tente novamente.")
    }
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

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Adicionar movimentação"
      >
        <Plus className="h-6 w-6" />
      </button>

      <NewMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          onRefresh(); // Trigger a refetch of the month resume
        }}
        personId={personId}
        baseDateStr={`${monthData.year}-${String(monthData.month).padStart(2, '0')}-01`}
      />
    </div>
  )
}
