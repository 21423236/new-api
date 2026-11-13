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

import { cn } from '@/lib/utils'

import defaultLogo from '../../../../public/logo.png'

interface HeaderLogoProps {
  src: string
  alt?: string
  loading?: boolean
  logoLoaded?: boolean
  className?: string
}

/**
 * Shared brand image with optional loading state and a bundled logo fallback.
 */
export function HeaderLogo({
  src,
  alt = 'logo',
  loading = false,
  logoLoaded = true,
  className,
}: HeaderLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const useFallback = !src || failedSrc === src

  return (
    <img
      src={useFallback ? defaultLogo : src}
      alt={alt}
      onError={useFallback ? undefined : () => setFailedSrc(src)}
      className={cn(
        'h-6 w-6 rounded-full transition-opacity duration-200',
        !loading && logoLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
    />
  )
}
