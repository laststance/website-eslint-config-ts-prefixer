'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { NavigationGlass } from '@/components/ui/liquid-glass'

export function Header() {
  return (
    <NavigationGlass
      as="header"
      config={{ thickness: 'ultra-thick', shadow: 'md' }}
      className="fixed top-0 left-0 right-0 z-50 border-b rounded-bl-glass-lg rounded-br-glass-lg"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold vibrancy-primary hover:text-primary transition-colors"
        >
          eslint-config-ts-prefixer
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="glass-thin glass-border rounded-glass glass-transition hover:glass-medium"
          >
            <Link
              href="https://github.com/laststance/eslint-config-ts-prefixer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5 vibrancy-primary" />
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </NavigationGlass>
  )
}
