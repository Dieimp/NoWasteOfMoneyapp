"use client"

import { useState } from "react"
import { monthsData } from "@/lib/transactions-data"
import { MonthSelector } from "@/components/month-selector"
import { TransactionsScreen } from "@/components/transactions-screen"

export default function Home() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null)

  if (selectedMonthIndex !== null) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-md">
        <TransactionsScreen
          monthData={monthsData[selectedMonthIndex]}
          onBack={() => setSelectedMonthIndex(null)}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md">
      <MonthSelector
        months={monthsData}
        onSelect={(index) => setSelectedMonthIndex(index)}
      />
    </main>
  )
}
