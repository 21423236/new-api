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
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { Footer } from '../footer'

const initialConfig = useSystemConfigStore.getState().config
let client: QueryClient

afterEach(() => {
  cleanup()
  client?.clear()
  useSystemConfigStore.getState().setConfig(initialConfig)
})

test.each([false, true])(
  'hideSiteCopyright=%s preserves project attribution and legal links',
  async (hidden) => {
    client = new QueryClient()
    client.setQueryData(STATUS_QUERY_KEY, {
      user_agreement_enabled: true,
      privacy_policy_enabled: true,
    })
    useSystemConfigStore
      .getState()
      .setConfig({
        systemName: 'API100',
        footerHtml: '',
        demoSiteEnabled: false,
      })
    const root = createRootRoute({
      component: () => <Footer hideSiteCopyright={hidden} />,
    })
    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })
    render(
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )
    expect(
      await screen.findByRole('link', { name: 'New API' })
    ).toHaveAttribute('href', 'https://github.com/QuantumNous/new-api')
    expect(
      screen.getByRole('link', { name: 'User Agreement' })
    ).toHaveAttribute('href', '/user-agreement')
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toHaveAttribute('href', '/privacy-policy')
    const copyright = screen.queryByText(/© .*API100/)
    if (hidden) expect(copyright).not.toBeInTheDocument()
    else expect(copyright).toBeInTheDocument()
  }
)
