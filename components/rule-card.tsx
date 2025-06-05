import { Button } from '@/components/ui/button'
import type { EslintRule } from '@/lib/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon } from 'lucide-react' // Corrected import
import Link from 'next/link'

interface RuleCardProps {
  rule: EslintRule
}

export function RuleCard({ rule }: RuleCardProps) {
  return (
    <Card
      id={rule.id}
      className="scroll-mt-24 bg-card/80 dark:bg-card/70 backdrop-blur-sm shadow-xl border"
    >
      {' '}
      {/* scroll-mt for fixed header offset */}
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          {rule.ruleName}
        </CardTitle>
        {rule.pluginName && rule.pluginName !== 'N/A' && (
          <CardDescription className="pt-1">
            Plugin: <Badge variant="secondary">{rule.pluginName}</Badge>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2 text-foreground/90">
            Description
          </h3>
          <p className="text-muted-foreground">
            Detailed description for this rule is not available in the current
            data. Please refer to the official documentation linked below.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2 text-foreground/90">
            Examples
          </h3>
          <p className="text-muted-foreground">
            Example code snippets are not available in the current data. Please
            refer to the official documentation linked below.
          </p>
          {/* 
          Future enhancement: If example code is available, display it here.
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto mt-2">
            <code className="font-mono">// Example code for {rule.ruleName}</code>
          </pre> 
          */}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2 text-foreground/90">
            Options
          </h3>
          <p className="text-muted-foreground">
            Information about configurable options is not available in the
            current data. Please refer to the official documentation linked
            below.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="px-0">
          <Link
            href={rule.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm"
          >
            View Full Documentation
            <ExternalLinkIcon className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
