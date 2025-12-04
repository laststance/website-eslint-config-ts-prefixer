'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { EslintRule } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Download, Settings, Sparkles, FileText, Menu } from 'lucide-react'

interface RulesSidebarProps {
  rules: EslintRule[]
}

export function RulesSidebar({ rules }: RulesSidebarProps) {
  const [open, setOpen] = useState(false)

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

  const SidebarContent = () => (
    <nav className="space-y-6 h-full">
      {/* Quick Navigation */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold px-2 mb-2 text-gray-900 dark:text-gray-100">
          Getting Started
        </h3>
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start h-auto py-2 px-2 text-sm text-gray-900 hover:text-black hover:bg-gray-200/70 dark:text-gray-300 dark:hover:text-gray-100 font-medium"
        >
          <Link href="#installation" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Installation
          </Link>
        </Button>
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start h-auto py-2 px-2 text-sm text-gray-900 hover:text-black hover:bg-gray-200/70 dark:text-gray-300 dark:hover:text-gray-100 font-medium"
        >
          <Link href="#configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </Link>
        </Button>
      </div>

      {/* Rules Section */}
      <div>
        <h3 className="text-sm font-semibold px-2 mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <FileText className="h-4 w-4" />
          Configured Rules
        </h3>
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-4">
            {Object.entries(groupedRules).map(([pluginName, pluginRules]) => (
              <div key={pluginName}>
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-400 px-2 mb-1 uppercase tracking-wide">
                  {pluginName}
                </h4>
                <ul className="space-y-0.5">
                  {pluginRules.map((rule) => (
                    <li key={rule.id}>
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start text-left h-auto py-1.5 px-2 text-sm text-gray-900 hover:text-black hover:bg-gray-200/70 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-muted/50 font-medium"
                      >
                        <Link href={`#${rule.id}`} className="block rounded-md">
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
  )

  return (
    <>
      {/* Mobile Menu Button - lg未満でのみ表示 */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 bottom-6 z-60 glass-medium glass-border glass-shadow-lg hover:glass-thick"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="glass-sidebar glass-layered p-4 h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar - lg以上でのみ表示 */}
      <aside className="hidden lg:block lg:fixed lg:left-0 lg:top-16 lg:w-72 lg:h-[calc(100vh-4rem)] glass-sidebar glass-layered glass-border glass-shadow-md p-4 z-40 border-r rounded-tr-glass-lg">
        <SidebarContent />
      </aside>
    </>
  )
}
