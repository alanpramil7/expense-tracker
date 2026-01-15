import { HeadContent, Scripts, createRootRoute, useMatches } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { QueryClient } from '@tanstack/react-query'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/tanstack-react-start'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar'

export const Route = createRootRoute<
  { queryClient: QueryClient }
>({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Expense Tracker',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  return (
    <h1>This route is not Found</h1>
  )
}

function Header() {
  const matches = useMatches()
  const pageMath = matches.find(m => m.routeId !== '__root__')
  if (!pageMath) {
    return (
      <SidebarTrigger />
    )
  }

  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/settings': 'Settings'
  }
  const title = titles[pageMath.routeId]

  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <h1 className="text-xl font-semibold leading-none mt-1 text-muted-foreground">{title}</h1>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider >
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <SignedIn>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                  <Header />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </SignedIn>
          <SignedOut>
            {children}
          </SignedOut>
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  )
}
