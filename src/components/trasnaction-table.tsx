import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "convex/_generated/api"
import { Receipt } from "lucide-react"
import { useMemo } from "react"

export function TableDemo() {
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery(
    convexQuery(api.transaction.getAllTransactions, {})
  )
  const { data: incomeCategories } = useQuery(
    convexQuery(api.category.getCategoryByType, { type: "income" })
  )
  const { data: expenseCategories } = useQuery(
    convexQuery(api.category.getCategoryByType, { type: "expense" })
  )

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const cat of incomeCategories ?? []) {
      map.set(cat._id, cat.name)
    }
    for (const cat of expenseCategories ?? []) {
      map.set(cat._id, cat.name)
    }
    return map
  }, [incomeCategories, expenseCategories])

  if (isLoadingTransactions) {
    return (
      <Card className="rounded-2xl border-0 shadow-md animate-fade-in-up stagger-2">
        <CardContent className="flex flex-1 items-center justify-center p-8">
          <div>Loading...</div>
        </CardContent>
      </Card>
    )
  }

  // Show most recent first, limit to 10
  const recentTransactions = transactions?.slice(0, 10) ?? []

  if (!recentTransactions.length) {
    return (
      <Card className="flex flex-col min-h-0 overflow-hidden rounded-2xl border-0 shadow-md animate-fade-in-up stagger-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          <CardDescription>Your latest activity</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted animate-pulse-soft">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-0 shadow-md animate-fade-in-up stagger-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        <CardDescription>Last 10 transactions</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((t) => (
              <TableRow key={t._id}>
                <TableCell className="font-medium">
                  {categoryMap.get(t.categoryId) ?? "Unknown"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(t.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </TableCell>
                <TableCell className={`text-right font-semibold ${t.type === "income" ? "text-chart-3" : "text-destructive"
                  }`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
