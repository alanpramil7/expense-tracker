import { OverviewCard } from '@/components/overview-card';
import { Card, CardContent } from '@/components/ui/card';
import { authStateFn } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router'

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

function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      {/*Overview Cards*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard title="Total Balance" value={0} />
        <OverviewCard title="Income" value={0} />
        <OverviewCard title="Expenses" value={0} />
        <OverviewCard title="Savings" value={0} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-4 min-h-0">
        {/* Add two graphs side by side*/}
        <Card className="flex flex-col min-h-0 overflow-hidden">
          <CardContent className="flex flex-1 items-center justify-center overflow-auto">
            <p className="text-muted-foreground">Chart placeholder</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col min-h-0 overflow-hidden">
          <CardContent className="flex flex-1 items-center justify-center overflow-auto">
            <p className="text-muted-foreground">Table placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
