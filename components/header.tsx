'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50 rounded-bl-lg rounded-br-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          eslint-config-ts-prefixer
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
          >
            <Link
              href="https://github.com/laststance/eslint-config-ts-prefixer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
