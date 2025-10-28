'use client'

import Link from 'next/link'
import type { EslintRule } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Download, Settings, Sparkles, FileText } from 'lucide-react'

interface RulesSidebarProps {
  rules: EslintRule[]
}

export function RulesSidebar({ rules }: RulesSidebarProps) {
  // Group rules by plugin
  const groupedRules = rules.reduce(
    (acc, rule) => {
      const group = rule.pluginName
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(rule)
      return acc
    },
    {} as Record<string, EslintRule[]>,
  )

  return (
    <aside className="w-full md:fixed md:left-0 md:top-16 md:w-72 md:h-[calc(100vh-4rem)] glass-thick glass-layered glass-border glass-shadow-md p-4 z-40 border-r rounded-tr-glass-lg">
      <nav className="space-y-6">
        {/* Quick Navigation */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold px-2 mb-2 vibrancy-secondary">
            Getting Started
          </h3>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start h-auto py-2 px-2 text-sm"
          >
            <Link href="#installation" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Installation
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start h-auto py-2 px-2 text-sm"
          >
            <Link href="#configuration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start h-auto py-2 px-2 text-sm"
          >
            <Link href="#features" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Key Features
            </Link>
          </Button>
        </div>

        {/* Rules Section */}
        <div>
          <h3 className="text-sm font-semibold px-2 mb-2 flex items-center gap-2 vibrancy-secondary">
            <FileText className="h-4 w-4" />
            Configured Rules
          </h3>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-4">
              {Object.entries(groupedRules).map(([pluginName, pluginRules]) => (
                <div key={pluginName}>
                  <h4 className="text-xs font-semibold text-muted-foreground px-2 mb-1">
                    {pluginName}
                  </h4>
                  <ul className="space-y-0.5">
                    {pluginRules.map((rule) => (
                      <li key={rule.id}>
                        <Button
                          variant="ghost"
                          asChild
                          className="w-full justify-start text-left h-auto py-1.5 px-2 text-sm"
                        >
                          <Link
                            href={`#${rule.id}`}
                            className="block text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md"
                          >
                            {rule.ruleName}
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </nav>
    </aside>
  )
}
