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
    // Initialize month movements
    async function initData() {
      try {
        try {
          const userInfoStr = getCookie("user_info")
          if (userInfoStr) {
            const userInfo = JSON.parse(decodeURIComponent(userInfoStr))
            if (userInfo.name) setUserName(userInfo.name)
          }
        } catch (e) {
          console.error("Error reading user_info cookie:", e)
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // 1-12
        const initialMonthsData: MonthData[] = [];

        for (let i = 1; i <= currentMonth; i++) {
          initialMonthsData.push({
            month: i,
            year: currentYear,
            label: `${MONTH_NAMES[i - 1]} ${currentYear}`,
            total: 0,
            transactions: []
          })
        }

        setMonthsData(initialMonthsData);
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initData()
  }, [])

  const handleSelectMonth = async (index: number) => {
    setIsLoading(true);
    try {
      let personId = "";
      try {
        const userInfoStr = getCookie("user_info")
        if (userInfoStr) {
          const userInfo = JSON.parse(decodeURIComponent(userInfoStr))
          if (userInfo.personId) personId = userInfo.personId
        }
      } catch (e) {
        console.error("Error reading user_info cookie:", e)
      }

      const selectedMonth = monthsData[index];
      let updatedMonth = { ...selectedMonth };

      // We use the day format exactly as requested by user
      const dateStr = `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, '0')}-1`
      const res = await fetch(`/api/month-movements/resume?personId=${personId}&date=${dateStr}`)
      if (res.ok) {
        const data = await res.json()
        console.log("Month movements data fetched on click:", data)

        const rawMovements = data.movements || data.Movements || [];
        const rawTotal = data.total !== undefined ? data.total : (data.Total || 0);

        const mappedTransactions: Transaction[] = rawMovements.map((m: any) => {
          const mValue = m.value !== undefined ? m.value : (m.Value || 0);
          const mId = m.id || m.Id;
          const mDate = m.date || m.Date;
          const mMovementName = m.movement?.name || m.Movement?.Name || m.movement?.Name || m.Movement?.name || "Transação";
          const mTypeId = m.movement?.movementTypeId || m.Movement?.MovementTypeId || m.movement?.MovementTypeId || m.Movement?.movementTypeId;
          
          let tType: "income" | "expense" = "income";
          if (mTypeId === 1) {
              tType = "expense";
          } else if (mTypeId === 2) {
              tType = "income";
          } else {
              tType = mValue >= 0 ? "income" : "expense"; // fallback
          }

          return {
            id: mId,
            type: tType,
            amount: Math.abs(mValue),
            date: mDate ? new Date(mDate).toLocaleDateString("pt-BR") : new Date(selectedMonth.year, selectedMonth.month - 1, 1).toLocaleDateString("pt-BR"),
            description: mMovementName,
          };
        });

        updatedMonth = {
          ...selectedMonth,
          total: rawTotal || 0,
          transactions: mappedTransactions,
          isLoaded: true
        };
      } else {
        console.error("Failed to fetch resume:", await res.text());
      }

      const updatedMonthsData = [...monthsData];
      updatedMonthsData[index] = updatedMonth;
      setMonthsData(updatedMonthsData);

    } catch (err) {
      console.error("Error fetching specific month data:", err);
    } finally {
      setIsLoading(false);
      setSelectedMonthIndex(index);
    }
  }

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
          personId={getCookie("user_info") ? JSON.parse(decodeURIComponent(getCookie("user_info")!)).personId : null}
          onBack={() => setSelectedMonthIndex(null)}
          onRefresh={() => handleSelectMonth(selectedMonthIndex)}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md">
      <MonthSelector
        userName={userName}
        months={monthsData}
        onSelect={handleSelectMonth}
      />
    </main>
  )
}
