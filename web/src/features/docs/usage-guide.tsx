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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CodeBlock } from '@/components/ai-elements/code-block'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  getGuideConfiguration,
  guideShells,
  guideTools,
  type GuideShell,
} from './configuration'

export function UsageGuide(props: { origin: string }) {
  const { t } = useTranslation()
  const [shell, setShell] = useState<GuideShell>('bash')
  const modelsUrl = `${props.origin.replace(/\/+$/, '')}/v1/models`
  let catalogCommand = `curl "${modelsUrl}" -H "Authorization: Bearer $NEW_API_KEY"`
  if (shell === 'cmd') {
    catalogCommand = `curl.exe "${modelsUrl}" -H "Authorization: Bearer %NEW_API_KEY%"`
  } else if (shell === 'powershell') {
    catalogCommand = `Invoke-RestMethod -Uri '${modelsUrl}' -Headers @{ Authorization = "Bearer $env:NEW_API_KEY" } | ConvertTo-Json -Depth 10`
  }

  return (
    <Tabs
      defaultValue='gemini'
      className='bg-card min-w-0 rounded-2xl border p-4 shadow-sm md:p-8'
    >
      <div className='max-w-full overflow-x-auto pb-2'>
        <TabsList aria-label={t('Tool')} variant='line'>
          {guideTools.map((tool) => (
            <TabsTrigger key={tool.id} value={tool.id} className='px-4'>
              {tool.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {guideTools.map((tool) => {
        const guide = getGuideConfiguration(tool.id, shell, props.origin)
        return (
          <TabsContent
            key={tool.id}
            value={tool.id}
            className='min-w-0 space-y-6 pt-4'
          >
            <p className='text-muted-foreground leading-relaxed'>
              {t(
                'Replace <你的密钥> with your API key and <MODEL_ID> with a model available to your key.'
              )}
            </p>
            <section className='space-y-3'>
              <h2 className='text-lg font-semibold'>
                1. {t('Install the tool')}
              </h2>
              <Button
                variant='outline'
                render={
                  <a
                    href={tool.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                }
              >
                {tool.name} · {t('Official documentation')}
              </Button>
            </section>
            {guide.environment && (
              <section className='space-y-4'>
                <h2 className='text-lg font-semibold'>
                  2. {t('Configure your terminal')}
                </h2>
                <Tabs
                  value={shell}
                  onValueChange={(value) => setShell(value as GuideShell)}
                >
                  <div className='max-w-full overflow-x-auto pb-2'>
                    <TabsList aria-label={t('Terminal')}>
                      {guideShells.map((item) => (
                        <TabsTrigger
                          key={item.id}
                          value={item.id}
                          className='px-3'
                        >
                          {item.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  {guideShells.map((item) => (
                    <TabsContent
                      key={item.id}
                      value={item.id}
                      className='min-w-0'
                    >
                      <CodeBlock
                        code={guide.environment}
                        language={shell}
                        title={t('Terminal')}
                        showToolbar
                      >
                        <CopyButton value={guide.environment} size='sm'>
                          {t('Copy')}
                        </CopyButton>
                      </CodeBlock>
                    </TabsContent>
                  ))}
                </Tabs>
                <p className='bg-primary/5 text-muted-foreground rounded-lg border p-4 text-sm leading-relaxed'>
                  {t(
                    'These variables apply to the current terminal. For persistence, use ~/.bashrc or ~/.zshrc on macOS/Linux, $PROFILE in PowerShell, or Windows user environment variables for CMD.'
                  )}
                </p>
              </section>
            )}
            {guide.config && (
              <section className='space-y-3'>
                <h2 className='text-lg font-semibold'>
                  {t('Configuration file')}
                </h2>
                <p className='text-muted-foreground text-sm'>
                  {tool.id === 'opencode'
                    ? t(
                        'OpenCode V2: create ~/.config/opencode/opencode.json (or opencode.jsonc). Replace the keys and use /models to select a model. OpenAI and Anthropic use /v1; Google uses /v1beta. Model limits and reasoning options are examples; adjust them to your provider.'
                      )
                    : t(
                        'Save this file in your home directory, export NEW_API_KEY, then restart Codex. Use a Responses-compatible model for both model and review_model.'
                      )}
                </p>
                <CodeBlock
                  code={guide.config}
                  language={guide.language}
                  title={guide.filename}
                  showToolbar
                >
                  <CopyButton value={guide.config} size='sm'>
                    {t('Copy')}
                  </CopyButton>
                </CodeBlock>
              </section>
            )}
            <section className='space-y-3'>
              <h2 className='text-lg font-semibold'>
                3. {t('Start in the same terminal')}
              </h2>
              <CodeBlock
                code={guide.command}
                language={shell}
                title={t('Terminal')}
                showToolbar
              >
                <CopyButton value={guide.command} size='sm'>
                  {t('Copy')}
                </CopyButton>
              </CodeBlock>
            </section>
            {tool.id === 'codex' && (
              <section className='space-y-3 rounded-xl border p-4'>
                <h2 className='font-semibold'>{t('Models')}</h2>
                <p className='text-muted-foreground text-sm'>
                  {t(
                    'Run this command after setting NEW_API_KEY to list models available to your key. The /v1/models response is an OpenAI model list, not a Codex-native catalog; do not use it as model_catalog_url or model_catalog_json.'
                  )}
                </p>
                <CodeBlock
                  code={catalogCommand}
                  language={shell}
                  title={modelsUrl}
                  showToolbar
                >
                  <CopyButton value={catalogCommand} size='sm'>
                    {t('Copy')}
                  </CopyButton>
                </CodeBlock>
              </section>
            )}
            {tool.id !== 'opencode' && (
              <aside className='text-muted-foreground space-y-2 border-t pt-5 text-sm leading-relaxed'>
                <h2 className='text-foreground font-semibold'>
                  {t('Troubleshooting')}
                </h2>
                <p>
                  {t(
                    'For connection errors, check the API address, key validity, balance, and model permissions. Gemini uses the site root; Codex and OpenCode use /v1. Codex requires a Responses-compatible model; OpenCode requires a tool-capable model.'
                  )}
                </p>
              </aside>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
