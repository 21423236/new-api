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
import { act, render, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { HeroHyperspeed } from '../hero-hyperspeed'

const gpu = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>()
  return {
    ...actual,
    WebGLRenderer: class {
      constructor() {
        gpu.create()
        throw new Error('WebGL unavailable')
      }
    },
  }
})

afterEach(() => {
  vi.restoreAllMocks()
  gpu.create.mockClear()
})

test('reduced motion retains the decorative static background without starting WebGL', () => {
  const { container } = render(<HeroHyperspeed />)
  expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  expect(container.firstElementChild).toHaveClass('overflow-hidden')
  expect(container.firstElementChild).toHaveAttribute('data-boosting', 'false')
  expect(container.querySelector('.hyperspeed')).toBeNull()
  expect(container.querySelector('canvas')).toBeNull()
  expect(gpu.create).not.toHaveBeenCalled()
})

test('unavailable WebGL preserves the background and responding to reduced motion removes the animated surface', async () => {
  let onChange: (() => void) | undefined
  const media = {
    matches: false,
    addEventListener: (_: string, listener: () => void) => {
      onChange = listener
    },
    removeEventListener: vi.fn(),
  }
  vi.spyOn(window, 'matchMedia').mockReturnValue(
    media as unknown as MediaQueryList
  )
  const { container, unmount } = render(<HeroHyperspeed />)
  await waitFor(() => expect(gpu.create).toHaveBeenCalledOnce())
  expect(
    container.querySelector('.hero-hyperspeed-vignette')
  ).toBeInTheDocument()
  expect(container.querySelector('canvas')).toBeNull()
  act(() => {
    media.matches = true
    onChange?.()
  })
  expect(container.querySelector('.hyperspeed')).toBeNull()
  unmount()
  expect(media.removeEventListener).toHaveBeenCalledWith('change', onChange)
})
