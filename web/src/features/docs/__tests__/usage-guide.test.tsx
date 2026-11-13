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
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'

import { UsageGuide } from '../usage-guide'

test('public examples switch shell syntax and copy only the placeholder key', async () => {
  const user = userEvent.setup()
  render(<UsageGuide origin='https://gateway.example.com' />)
  const terminal = screen.getByRole('tabpanel', { name: 'macOS / Linux' })
  expect(terminal).toHaveTextContent("export GEMINI_API_KEY='<你的密钥>'")
  await user.click(
    within(terminal).getByRole('button', { name: 'Copy to clipboard' })
  )
  expect(await navigator.clipboard.readText()).toBe(
    "export GOOGLE_GEMINI_BASE_URL='https://gateway.example.com'\nexport GEMINI_API_KEY='<你的密钥>'"
  )
  await user.click(screen.getByRole('tab', { name: 'Windows CMD' }))
  expect(
    screen.getByRole('tabpanel', { name: 'Windows CMD' })
  ).toHaveTextContent('set "GEMINI_API_KEY=<你的密钥>"')
  await user.click(screen.getByRole('tab', { name: 'PowerShell' }))
  expect(
    screen.getByRole('tabpanel', { name: 'PowerShell' })
  ).toHaveTextContent("$env:GEMINI_API_KEY = '<你的密钥>'")
})

test('tool tabs retain the terminal and show matching configuration and launch commands', async () => {
  const user = userEvent.setup()
  render(<UsageGuide origin='https://gateway.example.com/' />)
  await user.click(screen.getByRole('tab', { name: 'PowerShell' }))
  await user.click(screen.getByRole('tab', { name: 'Codex CLI' }))
  expect(screen.getByRole('tab', { name: 'PowerShell' })).toHaveAttribute(
    'aria-selected',
    'true'
  )
  const codex = screen.getByRole('tabpanel', { name: 'Codex CLI' })
  expect(codex).toHaveTextContent('base_url = "https://gateway.example.com/v1"')
  expect(codex).toHaveTextContent('wire_api = "responses"')
  expect(codex).toHaveTextContent('review_model = "<MODEL_ID>"')
  expect(codex).toHaveTextContent('requires_openai_auth = false')
  expect(codex).toHaveTextContent('supports_websockets = false')
  expect(codex).toHaveTextContent(
    "Invoke-RestMethod -Uri 'https://gateway.example.com/v1/models'"
  )
  expect(codex).toHaveTextContent('%USERPROFILE%\\.codex\\config.toml')
  await user.click(screen.getByRole('tab', { name: 'OpenCode' }))
  const opencode = screen.getByRole('tabpanel', { name: 'OpenCode' })
  const download = within(opencode)
    .getByText('Download merge script')
    .closest('a')
  expect(download).toHaveAttribute('download', 'import-opencode.mjs')
  expect(decodeURIComponent(download?.getAttribute('href') ?? '')).toContain(
    'https://gateway.example.com/v1beta'
  )
  await user.click(
    within(opencode).getAllByRole('button', { name: 'Copy to clipboard' })[0]
  )
  const config = await navigator.clipboard.readText()
  expect(config).toContain('"providers"')
  expect(config).toContain('"baseURL": "https://gateway.example.com/v1beta"')
  expect(opencode).toHaveTextContent('~/.config/opencode/opencode.json')
  expect(config).toContain('"apiKey": "<你的密钥>"')
  expect(config).toContain('gemini-3.1-pro-preview')
  expect(config).toContain('gpt-6.1-sol')
  expect(config).toContain('claude-opus-5-5')
  expect(config).toContain('gemini-4-argon')
  expect(config).toContain('"store": false')
  expect(opencode).not.toHaveTextContent('NEW_API_KEY')
  expect(opencode).not.toHaveTextContent('GEMINI_API_KEY')
})

test('keyboard navigation selects tools and tab rows support horizontal overflow', async () => {
  const user = userEvent.setup()
  render(<UsageGuide origin='https://gateway.example.com' />)
  screen.getByRole('tab', { name: 'Gemini CLI' }).focus()
  await user.keyboard('{ArrowRight}{Enter}')
  expect(screen.getByRole('tab', { name: 'Codex CLI' })).toHaveFocus()
  expect(screen.getByRole('tabpanel', { name: 'Codex CLI' })).toBeVisible()
  for (const list of screen.getAllByRole('tablist')) {
    expect(list.parentElement).toHaveClass('overflow-x-auto')
  }
})
