import { HeadContent, Scripts, createRootRoute, useMatches, getRouteApi, useRouteContext } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { QueryClient } from '@tanstack/react-query'
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/tanstack-react-start'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar'
import { ThemeProvider, useTheme } from '@/context/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { catppuccinThemes } from '@/lib/theme'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

export const Route = createRootRoute<
  {
    queryClient: QueryClient,
    convexClient: ConvexReactClient,
    convexQueryClient: ConvexQueryClient

  }
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

  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/settings': 'Settings'
  }
  const title = pageMath ? titles[pageMath.routeId] : ''

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {title && <h1 className="text-xl font-semibold leading-none mt-1 text-muted-foreground">{title}</h1>}
      </div>
      <ThemeToggle />
    </div>
  )
}

// Wrap the default clerk provider with our custom theme
function ClerkThemedProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const themeVars = catppuccinThemes[resolvedTheme as 'light' | 'dark'] || catppuccinThemes.light
  const context = useRouteContext({ from: Route.id })

  return (
    <ClerkProvider appearance={{
      variables: themeVars,
    }}>
      <ConvexProviderWithClerk client={context.convexClient} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Theme provider runs its useeffect and use the colorscheme, the time taken to render the theme light theme will be applied,
        In case the user is in dark mode an flicker of light theme is visible
        this script will execute before and content render
        it take the theme fom localstorage and sync it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('expense-tracker-theme') || 'system';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.add(theme === 'system' ? systemTheme : theme);
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="expense-tracker-theme">
          <ClerkThemedProvider>
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
          </ClerkThemedProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
