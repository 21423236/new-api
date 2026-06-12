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
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  KeyRound,
  Rocket,
  Settings2,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

const QUICK_START_STEPS = [
  {
    title: 'Create an account',
    description: 'Sign up or sign in to enter the console.',
    icon: Rocket,
  },
  {
    title: 'Generate an API key',
    description: 'Create a key in the token page and keep it secure.',
    icon: KeyRound,
  },
  {
    title: 'Call compatible endpoints',
    description: 'Use the OpenAI-compatible base URL in your tools or SDKs.',
    icon: Code2,
  },
]

const GUIDE_CARDS = [
  {
    title: 'Authentication',
    description: 'Send your key with the Authorization: Bearer header for every API request.',
    icon: ShieldCheck,
  },
  {
    title: 'Model selection',
    description: 'Choose an available model from the console or pricing page before sending requests.',
    icon: Settings2,
  },
  {
    title: 'Response handling',
    description: 'Handle normal JSON responses and streaming Server-Sent Events in your client.',
    icon: Terminal,
  },
]

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/v1/chat/completions',
    description: 'Chat Completions API for conversations and tool-compatible clients.',
  },
  {
    method: 'POST',
    path: '/v1/embeddings',
    description: 'Embedding API for vector search, retrieval, and semantic matching.',
  },
  {
    method: 'GET',
    path: '/v1/models',
    description: 'List models available to your account and configured channels.',
  },
]

const CLIENT_CONFIGS = [
  'Base URL: https://your-domain.example.com/v1',
  'API Key: copy a token from Console > Tokens',
  'Model: use an enabled model name from the model list',
]

export function Docs() {
  const { t } = useTranslation()

  return (
    <main className='bg-background min-h-screen px-6 py-24 md:py-32'>
      <div className='mx-auto flex max-w-6xl flex-col gap-10'>
        <section className='border-border/60 bg-card/60 relative overflow-hidden rounded-3xl border p-8 shadow-sm md:p-12'>
          <div
            aria-hidden
            className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_60%_90%,rgba(14,165,233,0.1),transparent_36%)]'
          />
          <div className='flex max-w-3xl flex-col gap-5'>
            <span className='text-primary inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase'>
              <BookOpen className='size-4' />
              {t('Docs')}
            </span>
            <h1 className='text-foreground text-4xl font-bold tracking-tight md:text-5xl'>
              {t('API documentation for your gateway')}
            </h1>
            <p className='text-muted-foreground text-base leading-7 md:text-lg'>
              {t(
                'Use this self-hosted guide as a starting point for account setup, API keys, compatible endpoints, and client configuration.'
              )}
            </p>
            <div className='flex flex-wrap gap-3 pt-2'>
              <Button render={<Link to='/sign-up' />}>
                {t('Create API Key')}
                <ArrowRight className='ml-2 size-4' />
              </Button>
              <Button variant='outline' render={<Link to='/pricing' />}>
                {t('Browse Models')}
              </Button>
            </div>
          </div>
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          {QUICK_START_STEPS.map((step, index) => {
            const Icon = step.icon

            return (
              <article
                key={step.title}
                className='border-border/60 bg-card rounded-2xl border p-6 shadow-sm'
              >
                <div className='mb-5 flex items-center justify-between'>
                  <div className='bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl'>
                    <Icon className='size-5' />
                  </div>
                  <span className='text-muted-foreground text-sm font-medium'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className='text-foreground text-lg font-semibold'>
                  {t(step.title)}
                </h2>
                <p className='text-muted-foreground mt-2 text-sm leading-6'>
                  {t(step.description)}
                </p>
              </article>
            )
          })}
        </section>

        <section className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='border-border/60 bg-card rounded-3xl border p-6 shadow-sm md:p-8'>
            <div className='mb-6 flex flex-col gap-2'>
              <span className='text-primary text-sm font-semibold uppercase tracking-wide'>
                {t('Request Example')}
              </span>
              <h2 className='text-foreground text-2xl font-semibold'>
                {t('Chat completion request')}
              </h2>
              <p className='text-muted-foreground text-sm leading-6'>
                {t(
                  'Replace the base URL, token, and model with values from your own deployment.'
                )}
              </p>
            </div>
            <pre className='bg-muted/70 text-foreground overflow-x-auto rounded-2xl p-5 text-sm leading-7'>
              <code>{`curl https://your-domain.example.com/v1/chat/completions \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'`}</code>
            </pre>
          </div>

          <div className='flex flex-col gap-6'>
            <section className='border-border/60 bg-card rounded-3xl border p-6 shadow-sm md:p-8'>
              <h2 className='text-foreground text-2xl font-semibold'>
                {t('Common endpoints')}
              </h2>
              <div className='mt-5 flex flex-col gap-4'>
                {ENDPOINTS.map((endpoint) => (
                  <div key={endpoint.path} className='flex flex-col gap-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-semibold'>
                        {endpoint.method}
                      </span>
                      <code className='text-foreground text-sm font-medium'>
                        {endpoint.path}
                      </code>
                    </div>
                    <p className='text-muted-foreground text-sm leading-6'>
                      {t(endpoint.description)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className='border-border/60 bg-card rounded-3xl border p-6 shadow-sm md:p-8'>
              <h2 className='text-foreground text-2xl font-semibold'>
                {t('Client configuration')}
              </h2>
              <div className='mt-5 flex flex-col gap-3'>
                {CLIENT_CONFIGS.map((item) => (
                  <div key={item} className='flex gap-3'>
                    <CheckCircle2 className='text-primary mt-0.5 size-4 shrink-0' />
                    <span className='text-muted-foreground text-sm leading-6'>
                      {t(item)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          {GUIDE_CARDS.map((card) => {
            const Icon = card.icon

            return (
              <article
                key={card.title}
                className='border-border/60 bg-card rounded-2xl border p-6 shadow-sm'
              >
                <div className='bg-primary/10 text-primary mb-5 flex size-11 items-center justify-center rounded-xl'>
                  <Icon className='size-5' />
                </div>
                <h2 className='text-foreground text-lg font-semibold'>
                  {t(card.title)}
                </h2>
                <p className='text-muted-foreground mt-2 text-sm leading-6'>
                  {t(card.description)}
                </p>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
