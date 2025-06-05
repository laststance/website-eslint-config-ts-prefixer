"use client"

import Link from "next/link"
import type { EslintRule } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RulesSidebarProps {
  rules: EslintRule[]
}

export function RulesSidebar({ rules }: RulesSidebarProps) {
  // const pathname = usePathname(); // Example if we want to highlight based on URL fragment

  return (
    <aside className="w-full md:fixed md:left-0 md:top-0 md:w-72 md:h-screen bg-card/80 dark:bg-card/70 backdrop-blur-md p-4 shadow-lg z-40 border-r">
      <h2 className="text-xl font-semibold mb-4 text-foreground px-2 pt-2">ESLint Rules</h2>
      <ScrollArea className="h-[calc(100vh-70px)]">
        {" "}
        {/* Adjust height based on title and padding */}
        <nav className="py-2">
          <ul className="space-y-1">
            {rules.map((rule) => (
              <li key={rule.id}>
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start text-left h-auto py-2 px-2 text-sm",
                    // Example for active link: typeof window !== 'undefined' && window.location.hash === `#${rule.id}` ? "bg-muted font-semibold" : "font-normal"
                  )}
                >
                  <Link
                    href={`#${rule.id}`}
                    className="block text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md p-1"
                  >
                    {rule.ruleName}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  )
}
