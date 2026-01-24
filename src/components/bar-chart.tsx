import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "convex/_generated/api"
import { BarChart3 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-2)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export function ChartBarMultiple() {
  // TODO: get the transaction based on date
  const { data: transactions, isLoading } = useQuery(
    convexQuery(api.transaction.getAllTransactions, {})
  )

  const { chartData, monthLabel } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const monthStart = new Date(year, month, 1).getTime()
    const monthEnd = new Date(year, month, daysInMonth, 23, 59, 59, 999).getTime()

    const monthName = now.toLocaleString("default", { month: "long", year: "numeric" })

    // This is not used when we get transaction by date
    const monthTransactions = (transactions ?? []).filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    )

    const weeks: { label: string; income: number; expense: number }[] = []
    let weekStart = 1
    while (weekStart <= daysInMonth) {
      const weekEnd = Math.min(weekStart + 6, daysInMonth)
      const label = `${weekStart}-${weekEnd}`

      const bucketStart = new Date(year, month, weekStart).getTime()
      const bucketEnd = new Date(year, month, weekEnd, 23, 59, 59, 999).getTime()

      let income = 0
      let expense = 0
      for (const t of monthTransactions) {
        if (t.date >= bucketStart && t.date <= bucketEnd) {
          if (t.type === "income") income += t.amount
          else expense += t.amount
        }
      }

      weeks.push({ label, income, expense })
      weekStart = weekEnd + 1
    }

    return { chartData: weeks, monthLabel: monthName }
  }, [transactions])

  if (isLoading) {
    return (
      <Card className="border-0">
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      </Card>
    );
  }

  const hasData = chartData.some((w) => w.income > 0 || w.expense > 0)

  if (!hasData) {
    return (
      <Card className="flex flex-col min-h-0 overflow-hidden rounded-2xl border-0 shadow-md animate-fade-in-up">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle>
          <CardDescription>{monthLabel}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted animate-pulse-soft">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No chart data yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-0 shadow-md animate-fade-in-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle>
        <CardDescription>{monthLabel} — weekly breakdown</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={6} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
