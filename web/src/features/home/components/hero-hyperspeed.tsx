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
import '@/styles/hyperspeed.css'
import { useEffect, useState } from 'react'

import { useTheme } from '@/context/theme-provider'
import { getLobeIcon } from '@/lib/lobe-icon'

const TAIL_COLORS = ['#ec4899', '#8b5cf6', '#d946ef']
const HEAD_COLORS = ['#38bdf8', '#22d3ee', '#a5f3fc']
const MODEL_LOGOS = [
  'OpenAI',
  'Claude.Color',
  'Gemini.Color',
  'DeepSeek.Color',
  'Qwen.Color',
  'Doubao.Color',
  'Grok',
]

type HyperspeedComponent = typeof import('./hyperspeed').default

export function HeroHyperspeed() {
  const { resolvedTheme } = useTheme()
  const [Effect, setEffect] = useState<HyperspeedComponent | null>(null)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [boosting, setBoosting] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    let active = true
    import('./hyperspeed')
      .then((module) => {
        if (active) setEffect(() => module.default)
      })
      .catch(() => {
        // The static background also covers unavailable animation chunks.
      })
    return () => {
      active = false
    }
  }, [reducedMotion])

  return (
    <div
      aria-hidden='true'
      data-boosting={boosting}
      className='hero-hyperspeed absolute inset-0 -z-10 overflow-hidden'
    >
      {!reducedMotion && Effect && (
        <Effect
          theme={resolvedTheme}
          curve='winding'
          curvature={0.8}
          speed={1}
          boost={4}
          boostFov={140}
          density={65}
          trailLength={1.35}
          poles={24}
          dust={180}
          glow={0.85}
          steer={0.5}
          tailColors={TAIL_COLORS}
          headColors={HEAD_COLORS}
          roadOpacity={0.16}
          reflections={0.5}
          interactive
          onBoostStart={() => setBoosting(true)}
          onBoostEnd={() => setBoosting(false)}
        />
      )}
      <div className='hero-hyperspeed-vignette pointer-events-none absolute inset-0' />
      <div className='hero-hyperspeed-logos pointer-events-none absolute inset-0'>
        {MODEL_LOGOS.map((logo) => (
          <span key={logo} className='hero-hyperspeed-logo'>
            <span className='hero-hyperspeed-logo-float'>
              {getLobeIcon(logo, 28)}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
