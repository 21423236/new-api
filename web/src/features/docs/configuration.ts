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
export type GuideTool = 'gemini' | 'codex' | 'opencode'
export type GuideShell = 'bash' | 'cmd' | 'powershell'

export const guideTools = [
  {
    id: 'gemini',
    name: 'Gemini CLI',
    url: 'https://geminicli.com/docs/get-started/installation/',
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    url: 'https://developers.openai.com/codex/cli/',
  },
  { id: 'opencode', name: 'OpenCode', url: 'https://opencode.ai/v2/docs/' },
] as const

export const guideShells = [
  { id: 'bash', name: 'macOS / Linux' },
  { id: 'cmd', name: 'Windows CMD' },
  { id: 'powershell', name: 'PowerShell' },
] as const

// Public examples only: never read or interpolate a user's actual API key.
export function getGuideConfiguration(
  tool: GuideTool,
  shell: GuideShell,
  origin: string
) {
  const baseUrl = origin.replace(/\/+$/, '')
  const variables: Record<string, string> =
    tool === 'gemini'
      ? { GOOGLE_GEMINI_BASE_URL: baseUrl, GEMINI_API_KEY: '<你的密钥>' }
      : { NEW_API_KEY: '<你的密钥>' }
  const environment = Object.entries(variables)
    .map(([key, value]) => {
      if (shell === 'cmd') return `set "${key}=${value}"`
      if (shell === 'powershell') return `$env:${key} = '${value}'`
      return `export ${key}='${value}'`
    })
    .join('\n')

  if (tool === 'gemini') {
    return {
      environment,
      command: 'gemini --model "<MODEL_ID>"',
      config: '',
      filename: '',
      language: 'json',
    }
  }
  if (tool === 'codex') {
    return {
      environment,
      command: 'codex',
      filename:
        shell === 'bash'
          ? '~/.codex/config.toml'
          : '%USERPROFILE%\\.codex\\config.toml',
      language: 'toml',
      config: `model_provider = "newapi"\nmodel = "<MODEL_ID>"\nreview_model = "<MODEL_ID>"\n\n[model_providers.newapi]\nname = "New API"\nbase_url = "${baseUrl}/v1"\nenv_key = "NEW_API_KEY"\nwire_api = "responses"\nrequires_openai_auth = false\nsupports_websockets = false`,
    }
  }
  return {
    environment: '',
    command: 'opencode',
    filename: '~/.config/opencode/opencode.json',
    language: 'json',
    config: JSON.stringify(
      {
        $schema: 'https://opencode.ai/config.json',
        model: 'gemini/gemini-2.5-flash',
        providers: {
          'openai-nb': {
            name: 'OpenAI',
            package: '@opencode/ai/providers/openai-compatible',
            settings: { baseURL: `${baseUrl}/v1`, apiKey: '<你的密钥>' },
            body: { store: false },
            models: Object.fromEntries(
              ['gpt-6-astra', 'gpt-6.1-terra', 'gpt-6.1-sol'].map((id) => [
                id,
                {
                  name: id,
                  limit: { context: 1050000, output: 128000 },
                  variants: ['low', 'medium', 'high', 'xhigh', 'max'].map(
                    (effort) => ({
                      id: effort,
                      settings: { reasoningEffort: effort },
                    })
                  ),
                },
              ])
            ),
          },
          anthropic: {
            name: 'Anthropic',
            package: '@opencode/ai/providers/anthropic',
            settings: { baseURL: `${baseUrl}/v1`, apiKey: '<你的密钥>' },
            models: {
              'claude-opus-5-5': {
                name: 'Claude Opus 5.5',
                limit: { context: 1000000, output: 128000 },
                capabilities: {
                  tools: true,
                  input: ['text', 'image', 'pdf'],
                  output: ['text'],
                },
                body: {
                  thinking: { type: 'adaptive' },
                  output_config: { effort: 'medium' },
                },
                variants: ['low', 'medium', 'high', 'xhigh', 'max'].map(
                  (effort) => ({
                    id: effort,
                    body: { output_config: { effort } },
                  })
                ),
              },
            },
          },
          gemini: {
            name: 'Gemini',
            package: '@opencode/ai/providers/google',
            settings: { baseURL: `${baseUrl}/v1beta`, apiKey: '<你的密钥>' },
            models: {
              'gemini-2.0-flash': { name: 'Gemini 2.0 Flash' },
              'gemini-2.5-flash': { name: 'Gemini 2.5 Flash' },
              'gemini-2.5-pro': { name: 'Gemini 2.5 Pro' },
              'gemini-3.5-flash': { name: 'Gemini 3.5 Flash' },
              'gemini-3-flash-preview': { name: 'Gemini 3 Flash Preview' },
              'gemini-3-pro-preview': { name: 'Gemini 3 Pro Preview' },
              'gemini-3.1-pro-preview': { name: 'Gemini 3.1 Pro Preview' },
              'gemini-3.8-flash-high': { name: 'Gemini 3.8 Flash High' },
              'gemini-4-argon': { name: 'Gemini 4 Argon' },
            },
          },
        },
      },
      null,
      2
    ),
  }
}
