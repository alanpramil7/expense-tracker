import { AddTranscationForm } from '@/components/add-transaction-form';
import { OverviewCard } from '@/components/overview-card';
import { Card, CardContent } from '@/components/ui/card';
import { authStateFn } from '@/lib/auth';
import { convexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { api } from 'convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { Receipt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ChartBarMultiple } from '@/components/bar-chart';
import { TableDemo } from '@/components/trasnaction-table';

export const Route = createFileRoute("/")({
  component: Dashboard,
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return {
      userId: context.userId,
      title: 'Dashboard',
    }
  }
})

function SkeletonCard() {
  return (
    <Card className="rounded-2xl border-0 shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-28 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { data: incomeData, isLoading: isLoadingIncome, error: incomeError } = useQuery(convexQuery(api.transaction.getTransactionByType, { type: 'income' }))
  const { data: expenseData, isLoading: isLoadingExpense, error: expenseError } = useQuery(convexQuery(api.transaction.getTransactionByType, { type: 'expense' }))

  if (incomeError) {
    throw new Error('Failed to get the income data.')
  }

  if (expenseError) {
    throw new Error('Failed to get the expense data.')
  }

  const isLoading = isLoadingIncome || isLoadingExpense;
  const totalIncome = incomeData?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
  const totalExpense = expenseData?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
  const savingsRate = totalIncome > 0
    ? Number(((totalIncome - totalExpense) / totalIncome * 100).toFixed(2))
    : 0;

  return (
    <div className="flex flex-1 flex-col gap-8 p-4">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <OverviewCard title="Total Balance" value={totalIncome - totalExpense} index={0} />
            <OverviewCard title="Income" value={totalIncome} index={1} />
            <OverviewCard title="Expenses" value={totalExpense} index={2} />
            <OverviewCard title="Savings Rate" value={savingsRate} index={3} />
          </>
        )}
      </div>

      {/* Analytics section */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-6 min-h-0">
        <ChartBarMultiple />
        <TableDemo />
      </div>

      <AddTranscationForm />
    </div>
  )
}
