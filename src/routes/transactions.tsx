import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { authStateFn } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Receipt, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
  beforeLoad: async () => await authStateFn(),
})

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 animate-fade-in-up stagger-${(index % 4) + 1}`}
    >
      <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-5 w-24 animate-pulse rounded bg-muted" />
    </div>
  )
}

function SkeletonTable() {
  return (
    <Card className="rounded-2xl border-0 shadow-md overflow-hidden">
      <CardContent className="p-0 divide-y divide-border/50">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonRow key={i} index={i} />
        ))}
      </CardContent>
    </Card>
  )
}

interface TransactionRowProps {
  category: string
  date: number
  amount: number
  type: 'income' | 'expense'
  index: number
}

function TransactionRow({ category, date, amount, type, index }: TransactionRowProps) {
  const isIncome = type === 'income'
  const Icon = isIncome ? TrendingUp : TrendingDown
  const ArrowIcon = isIncome ? ArrowUpRight : ArrowDownRight

  return (
    <div
      className={`group flex items-center gap-4 p-4 transition-all duration-200 animate-fade-in-up stagger-${(index % 4) + 1}`}
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${isIncome ? 'bg-chart-3/15' : 'bg-destructive/15'
          }`}
      >
        <Icon className={`h-5 w-5 ${isIncome ? 'text-chart-3' : 'text-destructive'}`} />
      </div>

      {/* Category & Date */}
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="font-medium text-foreground">{category}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-1.5">
        <ArrowIcon
          className={`h-4 w-4 ${isIncome ? 'text-chart-3' : 'text-destructive'}`}
        />
        <span
          className={`text-lg font-semibold tabular-nums ${isIncome ? 'text-chart-3' : 'text-destructive'
            }`}
        >
          {isIncome ? '+' : '-'}₹{amount.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  )
}

function TransactionsPage() {
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery(
    convexQuery(api.transaction.getAllTransactions, {})
  )
  const { data: incomeCategories } = useQuery(
    convexQuery(api.category.getCategoryByType, { type: 'income' })
  )
  const { data: expenseCategories } = useQuery(
    convexQuery(api.category.getCategoryByType, { type: 'expense' })
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

  const isLoading = isLoadingTransactions

  const stats = useMemo(() => {
    if (!transactions) return { total: 0, income: 0, expense: 0 }
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return { total: transactions.length, income, expense }
  }, [transactions])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight animate-fade-in-up">
          All Transactions
        </h1>
        {!isLoading && transactions?.length ? (
          <div className="flex items-center gap-4 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-chart-3" />
              <span className="text-muted-foreground">Income:</span>
              <span className="font-medium text-chart-3">
                ₹{stats.income.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Expense:</span>
              <span className="font-medium text-destructive">
                ₹{stats.expense.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : !transactions?.length ? (
        <Card className="rounded-2xl border-0 shadow-md animate-fade-in-up">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted animate-pulse-soft">
              <Receipt className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first transaction to get started
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-0 shadow-md overflow-hidden animate-fade-in-up stagger-1">
          {/* Transaction list */}
          <CardContent className="p-0 divide-y divide-border/50">
            {transactions.map((t, index) => (
              <TransactionRow
                key={t._id}
                category={categoryMap.get(t.categoryId) ?? 'Unknown'}
                date={t.date}
                amount={t.amount}
                type={t.type}
                index={index}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
