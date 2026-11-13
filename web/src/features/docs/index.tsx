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
import { BookOpen, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'

import { UsageGuide } from './usage-guide'

export function Docs() {
  const { t } = useTranslation()
  return (
    <PublicLayout>
      <div className='mx-auto w-full max-w-5xl space-y-8 px-4 py-10 md:py-16'>
        <header className='space-y-4'>
          <div className='text-primary flex items-center gap-2 text-sm font-medium'>
            <BookOpen className='size-4' aria-hidden='true' />
            {t('Docs')}
          </div>
          <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
            {t('API key usage guide')}
          </h1>
          <p className='text-muted-foreground max-w-3xl leading-relaxed'>
            {t(
              'Choose a tool and terminal, then follow the steps to connect to this site.'
            )}
          </p>
          <div className='flex flex-wrap gap-3'>
            <Button variant='outline' render={<Link to='/keys' />}>
              {t('API Keys')}
            </Button>
            <Button variant='ghost' render={<Link to='/pricing' />}>
              {t('Model Square')}
              <ExternalLink aria-hidden='true' className='size-4' />
            </Button>
          </div>
        </header>
        <UsageGuide origin={window.location.origin} />
      </div>
    </PublicLayout>
  )
}
