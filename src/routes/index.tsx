import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  return (
    <div>
      <h1>Expense Tracker</h1>
    </div>
  )
}
