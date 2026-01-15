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
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
    </div>
  );
}
