"use client"

import { useState, useEffect } from "react"
import { MonthSelector } from "@/components/month-selector"
import { TransactionsScreen } from "@/components/transactions-screen"
import { MonthData, Transaction } from "@/lib/transactions-data"

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Home() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null)
  const [monthsData, setMonthsData] = useState<MonthData[]>([])
  const [userName, setUserName] = useState<string>("Usuário")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user info from cookie
    try {
      const userInfoStr = getCookie("user_info")
      if (userInfoStr) {
        const userInfo = JSON.parse(decodeURIComponent(userInfoStr))
        if (userInfo.name) setUserName(userInfo.name)
      }
    } catch (e) {
      console.error("Error reading user_info cookie:", e)
    }

    // Fetch month movements
    async function fetchData() {
      try {
        const res = await fetch("/api/month-movements")
        if (!res.ok) {
          throw new Error("Failed to fetch")
        }

        const responseJson = await res.json()
        const backendMovements = responseJson.data || []

        // Build months for the current year up to the current month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // 1-12
        const newMonthsData: MonthData[] = [];

        for (let i = 1; i <= currentMonth; i++) {
          const monthMovements = backendMovements.filter((m: any) => m.month === i && m.year === currentYear);

          let total = 0;
          const mappedTransactions: Transaction[] = monthMovements.map((m: any) => {
            total += m.value || 0;
            return {
              id: m.id,
              type: (m.value || 0) >= 0 ? "income" : "expense",
              amount: Math.abs(m.value || 0),
              date: m.date || new Date(currentYear, i - 1, 1).toLocaleDateString("pt-BR"),
              description: m.movement?.name || "Transação",
            };
          });

          if (mappedTransactions.length > 0) {
            newMonthsData.push({
              month: i,
              year: currentYear,
              label: `${MONTH_NAMES[i - 1]} ${currentYear}`,
              total: total,
              transactions: mappedTransactions
            })
          }
        }

        setMonthsData(newMonthsData)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-md flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground">Carregando seus dados...</p>
        </div>
      </main>
    )
  }

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
        userName={userName}
        months={monthsData}
        onSelect={(index) => setSelectedMonthIndex(index)}
      />
    </main>
  )
}
