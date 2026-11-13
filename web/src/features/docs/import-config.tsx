import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

import { createOpenCodeImportScript } from './import-script'

export function ImportConfig(props: { config: string; origin: string }) {
  const { t } = useTranslation()
  const script = createOpenCodeImportScript(props.config, props.origin)
  return (
    <div className='bg-muted/30 space-y-3 rounded-xl border p-4'>
      <Button
        render={
          <a
            download='import-opencode.mjs'
            href={`data:text/javascript;charset=utf-8,${encodeURIComponent(script)}`}
          />
        }
      >
        {t('Download merge script')}
      </Button>
      <p className='text-muted-foreground text-sm'>
        {t(
          'Run node import-opencode.mjs in the download folder (Node.js 18+). The script backs up existing configuration before merging, or creates it when missing. It preserves other providers and settings, supports JSONC and XDG_CONFIG_HOME, and keeps keys local. JSONC comments are retained in the backup.'
        )}
      </p>
    </div>
  )
}
