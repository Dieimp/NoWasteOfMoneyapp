export type Transaction = {
  id: string
  type: "income" | "expense"
  amount: number
  date: string
  description?: string
}

export type MonthData = {
  month: number
  year: number
  label: string
  total: number
  transactions: Transaction[]
}

export const monthsData: MonthData[] = [
  {
    month: 3,
    year: 2025,
    label: "Março 2025",
    total: 1850.0,
    transactions: [
      {
        id: "1",
        type: "expense",
        amount: 150.0,
        date: "15/03/25",
        description: "Conta de luz",
      },
      {
        id: "2",
        type: "income",
        amount: 500.0,
        date: "10/03/25",
        description: "CDB de 110% no banco XPTO",
      },
      {
        id: "3",
        type: "income",
        amount: 1500.0,
        date: "05/03/25",
        description: "Salario",
      },
    ],
  },
  {
    month: 4,
    year: 2025,
    label: "Abril 2025",
    total: 2680.0,
    transactions: [
      {
        id: "4",
        type: "expense",
        amount: 20.0,
        date: "12/04/25",
      },
      {
        id: "5",
        type: "income",
        amount: 300.0,
        date: "12/04/25",
        description: "CDB de 110% no banco XPTO",
      },
      {
        id: "6",
        type: "income",
        amount: 300.0,
        date: "12/04/25",
        description: "CDB de 110% no banco XPTO",
      },
    ],
  },
  {
    month: 5,
    year: 2025,
    label: "Maio 2025",
    total: 3200.0,
    transactions: [
      {
        id: "7",
        type: "expense",
        amount: 80.0,
        date: "20/05/25",
        description: "Supermercado",
      },
      {
        id: "8",
        type: "income",
        amount: 200.0,
        date: "15/05/25",
        description: "Freelance",
      },
      {
        id: "9",
        type: "income",
        amount: 400.0,
        date: "10/05/25",
        description: "Rendimento poupanca",
      },
    ],
  },
]

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
