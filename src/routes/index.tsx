import { authStateFn } from '@/lib/auth';
import { SignOutButton } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return { userId: context.userId }
  }
})

function Home() {
  const state = Route.useLoaderData()

  return (
    <>
      <div>Hello Alan. Your id is {state.userId}</div>
      <SignOutButton />
    </>
  );
}
