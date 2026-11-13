/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Hero } from '@/features/home/components/sections/hero'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'

function NavigationFixture() {
  const links = useTopNavLinks()
  return (
    <>
      <nav>
        {links
          .filter((link) => link.title === 'Docs')
          .map((link) => (
            <a key={link.href} href={link.href}>
              {link.title}
            </a>
          ))}
      </nav>
      <Hero />
    </>
  )
}

test.each(['', 'https://old-docs.example.com'])(
  'header and home docs both use the public guide with legacy docs URL %s',
  async (docsLink) => {
    useAuthStore.getState().auth.reset()
    const queryClient = new QueryClient()
    queryClient.setQueryData(STATUS_QUERY_KEY, { docs_link: docsLink })
    const router = createRouter({
      routeTree: createRootRoute({ component: NavigationFixture }),
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })
    await router.load()
    const view = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )
    const docs = await screen.findAllByText('Docs')
    expect(docs).toHaveLength(2)
    for (const label of docs) {
      const link = label.closest('a')
      expect(link).toHaveAttribute('href', '/docs')
      expect(link).not.toHaveAttribute('target', '_blank')
    }
    view.unmount()
    queryClient.clear()
    useAuthStore.getState().auth.reset()
  }
)
