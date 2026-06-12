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
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Cpu, Network, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'
import { useStatus } from '@/hooks/use-status'
import { Button } from '@/components/ui/button'
import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

const PROVIDER_NODES = [
  { name: 'OpenAI', icon: 'OpenAI.Color', position: 'left-[7%] top-[18%]' },
  { name: 'Claude', icon: 'Claude.Color', position: 'right-[10%] top-[14%]' },
  { name: 'Gemini', icon: 'Gemini.Color', position: 'left-[4%] bottom-[16%]' },
  {
    name: 'DeepSeek',
    icon: 'DeepSeek.Color',
    position: 'right-[6%] bottom-[18%]',
  },
  { name: 'Qwen', icon: 'Qwen.Color', position: 'left-[38%] top-[4%]' },
  { name: 'Doubao', icon: 'Doubao.Color', position: 'left-[42%] bottom-[3%]' },
] as const

const PROVIDER_METRICS = [
  { value: '50+', label: 'Providers' },
  { value: '100+', label: 'Models' },
  { value: '1', label: 'Unified API' },
] as const

function ProviderNetwork() {
  const { t } = useTranslation()

  return (
    <div className='via-background/80 relative overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.08] to-violet-500/[0.08] p-4 shadow-[0_24px_80px_rgba(37,99,235,0.12)] backdrop-blur-xl dark:border-blue-400/15 dark:shadow-[0_24px_90px_rgba(59,130,246,0.08)]'>
      <div
        aria-hidden
        className='absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.12)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)] bg-[size:2rem_2rem] opacity-40'
      />
      <div
        aria-hidden
        className='provider-network-orbit absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20'
      />
      <div
        aria-hidden
        className='provider-network-orbit provider-network-orbit-reverse absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/15'
      />

      <div className='relative min-h-[300px] sm:min-h-[320px]'>
        <div className='absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3'>
          <div className='provider-network-core bg-background/90 relative flex size-24 items-center justify-center rounded-[2rem] border border-blue-400/25 shadow-[0_0_70px_rgba(59,130,246,0.28)] backdrop-blur-xl'>
            <div className='absolute inset-2 rounded-[1.5rem] bg-gradient-to-br from-blue-500/15 to-violet-500/15' />
            <Network className='relative size-9 text-blue-500 dark:text-blue-300' />
          </div>
          <div className='border-border/50 bg-background/80 text-muted-foreground rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase backdrop-blur'>
            {t('Unified Gateway')}
          </div>
        </div>

        <svg
          aria-hidden='true'
          className='absolute inset-0 size-full text-blue-500/30 dark:text-blue-300/25'
          viewBox='0 0 420 320'
          preserveAspectRatio='none'
        >
          <path className='provider-network-line' d='M210 160 L68 68' />
          <path className='provider-network-line' d='M210 160 L350 64' />
          <path className='provider-network-line' d='M210 160 L58 252' />
          <path className='provider-network-line' d='M210 160 L358 250' />
          <path className='provider-network-line' d='M210 160 L202 35' />
          <path className='provider-network-line' d='M210 160 L212 292' />
        </svg>

        {PROVIDER_NODES.map((provider, index) => (
          <div
            key={provider.name}
            className={`provider-network-node absolute ${provider.position}`}
            style={{ animationDelay: `${index * 180}ms` }}
          >
            <div className='group border-border/50 bg-background/85 flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-lg shadow-blue-500/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-blue-500/15'>
              <span className='bg-muted/60 flex size-8 items-center justify-center rounded-xl'>
                {getLobeIcon(provider.icon, 22)}
              </span>
              <span className='text-foreground/80 text-xs font-semibold'>
                {provider.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='border-border/40 relative mt-4 grid grid-cols-3 gap-2 border-t pt-4'>
        {PROVIDER_METRICS.map((metric) => (
          <div
            key={metric.label}
            className='border-border/40 bg-background/60 rounded-2xl border px-3 py-2 text-center backdrop-blur'
          >
            <div className='text-foreground text-base font-bold tracking-tight'>
              {metric.value}
            </div>
            <div className='text-muted-foreground mt-0.5 text-[10px]'>
              {t(metric.label)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl = (status?.docs_link as string | undefined) || '/docs'

  const renderDocsButton = () => {
    const isExternal = docsUrl.startsWith('http')
    if (isExternal) {
      return (
        <Button
          variant='outline'
          className='group border-border/50 hover:border-border hover:bg-muted/50 inline-flex h-11 items-center gap-1.5 rounded-lg px-5 text-sm font-medium'
          render={
            <a href={docsUrl} target='_blank' rel='noopener noreferrer' />
          }
        >
          <BookOpen className='text-muted-foreground/80 group-hover:text-foreground size-4 transition-colors duration-200' />
          <span>{t('Docs')}</span>
        </Button>
      )
    }
    return (
      <Button
        variant='outline'
        className='group border-border/50 hover:border-border hover:bg-muted/50 inline-flex h-11 items-center gap-1.5 rounded-lg px-5 text-sm font-medium'
        render={<Link to={docsUrl} />}
      >
        <BookOpen className='text-muted-foreground/80 group-hover:text-foreground size-4 transition-colors duration-200' />
        <span>{t('Docs')}</span>
      </Button>
    )
  }

  return (
    <section className='relative z-10 overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28'>
      {/* Radial gradient background */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-25 dark:opacity-[0.12]'
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 20% 20%, oklch(0.72 0.18 250 / 80%) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 40% at 80% 15%, oklch(0.65 0.15 200 / 60%) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 35% at 40% 80%, oklch(0.70 0.12 280 / 40%) 0%, transparent 70%)',
          ].join(', '),
        }}
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_20%,transparent_100%)] bg-[size:4rem_4rem] opacity-[0.08]'
      />

      <div className='mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8'>
        {/* Left Column: Title, description, action buttons and application support */}
        <div className='flex flex-col items-start text-left lg:col-span-6'>
          {/* Top Pill Badge */}
          <div
            className='landing-animate-fade-up mb-5 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-[11px] font-medium text-blue-600 opacity-0 shadow-xs dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-blue-400'
            style={{ animationDelay: '0ms' }}
          >
            <span className='relative flex size-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75' />
              <span className='relative inline-flex size-1.5 rounded-full bg-blue-500 dark:bg-blue-400' />
            </span>
            <span>{t('AI Application Infrastructure Foundation')}</span>
          </div>

          <h1
            className='landing-animate-fade-up text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.15] font-bold tracking-tight'
            style={{ animationDelay: '60ms' }}
          >
            {t('Unified API Gateway for')}
            <br />
            <span className='bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500 bg-clip-text text-transparent'>
              {t('Vast Range of AI Models')}
            </span>
          </h1>
          <p
            className='landing-animate-fade-up text-muted-foreground/80 mt-5 max-w-xl text-base leading-relaxed opacity-0 md:text-[15px]'
            style={{ animationDelay: '120ms' }}
          >
            {t(
              'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
            )}
          </p>

          <div
            className='landing-animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0'
            style={{ animationDelay: '180ms' }}
          >
            {props.isAuthenticated ? (
              <>
                <Button
                  className='group h-11 rounded-lg px-5 text-sm font-medium'
                  render={<Link to='/dashboard' />}
                >
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                {renderDocsButton()}
              </>
            ) : (
              <>
                <Button
                  className='group h-11 rounded-lg px-5 text-sm font-medium'
                  render={<Link to='/sign-up' />}
                >
                  {t('Get Started')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button
                  variant='outline'
                  className='border-border/50 hover:border-border hover:bg-muted/50 h-11 rounded-lg px-5 text-sm font-medium'
                  render={<Link to='/pricing' />}
                >
                  {t('View Pricing')}
                </Button>
                {renderDocsButton()}
              </>
            )}
          </div>

          {/* Animated provider network */}
          <div
            className='landing-animate-fade-up mt-10 w-full max-w-xl opacity-0'
            style={{ animationDelay: '240ms' }}
          >
            <div className='mb-4 flex flex-col gap-2'>
              <div className='inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/5 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-blue-600 uppercase dark:border-blue-400/15 dark:bg-blue-400/5 dark:text-blue-300'>
                <Cpu className='size-3' />
                {t('Model Provider Network')}
              </div>
              <h2 className='text-lg font-semibold tracking-tight'>
                {t(
                  'Connect leading AI providers through one intelligent gateway'
                )}
              </h2>
              <p className='text-muted-foreground/70 max-w-lg text-xs leading-relaxed'>
                {t(
                  'Route OpenAI, Claude, Gemini, DeepSeek, Qwen, and more with unified protocol conversion, billing, and observability.'
                )}
              </p>
            </div>
            <ProviderNetwork />
            <div className='text-muted-foreground/70 mt-3 flex items-center gap-2 text-[11px]'>
              <Zap className='size-3.5 text-blue-500' />
              <span>
                {t(
                  'Live routing, fallback, quota, and cost controls stay synchronized.'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Terminal API Demo */}
        <div
          className='landing-animate-fade-up flex w-full justify-center opacity-0 lg:col-span-6'
          style={{ animationDelay: '320ms' }}
        >
          <HeroTerminalDemo className='mt-8 lg:mt-0' />
        </div>
      </div>
    </section>
  )
}
