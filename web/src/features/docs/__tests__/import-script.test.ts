import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, expect, test } from 'vitest'

import { getGuideConfiguration } from '../configuration'
import { createOpenCodeImportScript } from '../import-script'

let root: string
let dir: string
let script: string
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'opencode-import-'))
  dir = join(root, 'opencode')
  mkdirSync(dir)
  script = join(root, 'import.mjs')
  writeFileSync(
    script,
    createOpenCodeImportScript(
      getGuideConfiguration('opencode', 'bash', 'https://gateway.example.com')
        .config,
      'https://gateway.example.com'
    )
  )
})
afterEach(() => rmSync(root, { recursive: true, force: true }))
function runImport() {
  return execFileSync('node', [script], {
    env: { ...process.env, XDG_CONFIG_HOME: root },
    stdio: 'pipe',
  })
}
test('missing configuration is created without a backup and scopes providers to the site', () => {
  runImport()
  const config = JSON.parse(readFileSync(join(dir, 'opencode.json'), 'utf8'))
  expect(
    config.providers['newapi-gateway-example-com-gemini'].settings.apiKey
  ).toBe('<你的密钥>')
  expect(config.model).toBe(
    'newapi-gateway-example-com-gemini/gemini-2.5-flash'
  )
  expect(readdirSync(dir)).toEqual(['opencode.json'])
})
test('JSONC is backed up exactly before merging and repeated imports retain local keys', () => {
  const original =
    '// comment\n{"model":"custom/model","plugins":["keep"],"providers":{"gemini":{"settings":{"apiKey":"existing"}}},"url":"https://example.com/a,}",}'
  const file = join(dir, 'opencode.jsonc')
  writeFileSync(file, original)
  runImport()
  let config = JSON.parse(readFileSync(file, 'utf8'))
  expect(config.model).toBe('custom/model')
  expect(config.plugins).toEqual(['keep'])
  expect(config.providers.gemini.settings.apiKey).toBe('existing')
  expect(config.url).toBe('https://example.com/a,}')
  const backup = readdirSync(dir).find((name) => name.includes('.bak-'))
  if (!backup) throw new Error('Expected backup file')
  expect(readFileSync(join(dir, backup), 'utf8')).toBe(original)
  config.providers['newapi-gateway-example-com-gemini'].settings.apiKey =
    'local-key'
  writeFileSync(file, JSON.stringify(config))
  runImport()
  config = JSON.parse(readFileSync(file, 'utf8'))
  expect(
    config.providers['newapi-gateway-example-com-gemini'].settings.apiKey
  ).toBe('local-key')
  expect(
    readdirSync(dir).filter((name) => name.includes('.bak-'))
  ).toHaveLength(2)
})
test('invalid configuration fails without modifying or backing up the original', () => {
  const file = join(dir, 'opencode.json')
  writeFileSync(file, '{invalid')
  expect(runImport).toThrow()
  expect(readFileSync(file, 'utf8')).toBe('{invalid')
  expect(readdirSync(dir)).toEqual(['opencode.json'])
})

test('when JSON and JSONC coexist, JSONC takes precedence and JSON remains untouched', () => {
  const json = '{"model":"lower/model","plugins":["keep"]}'
  writeFileSync(join(dir, 'opencode.json'), json)
  writeFileSync(join(dir, 'opencode.jsonc'), '{"model":"higher/model"}')
  runImport()
  const result = JSON.parse(readFileSync(join(dir, 'opencode.jsonc'), 'utf8'))
  expect(result.model).toBe('higher/model')
  expect(result.plugins).toEqual(['keep'])
  expect(readFileSync(join(dir, 'opencode.json'), 'utf8')).toBe(json)
  expect(
    readdirSync(dir).filter((name) => name.startsWith('opencode.jsonc.bak-'))
  ).toHaveLength(1)
})
