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
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'
import {
  processEslintMarkdown,
  extractRuleDescription,
  removeInitialDescription,
} from '@/lib/markdown-utils'
import { HeadingAnchor } from '@/components/heading-anchor'
import { slugify } from '@/lib/slugify'

interface RuleCardProps {
  rule: EslintRule
}

export function RuleCard({ rule }: RuleCardProps) {
  // Get the title from frontmatter or fallback to rule name
  const title = rule.frontmatter.title || rule.ruleName
  const description =
    rule.frontmatter.description || extractRuleDescription(rule.content)

  // Remove the initial description from content to avoid duplication
  const contentWithoutDescription = removeInitialDescription(
    rule.content,
    description,
  )

  // Process the markdown content to handle ESLint-specific syntax
  const processedContent = processEslintMarkdown(contentWithoutDescription)

  return (
    <Card
      id={rule.id}
      className="scroll-mt-24 glass-clear glass-dimmed glass-border glass-shadow-md rounded-glass-lg glass-transition hover:glass-shadow-lg hover:-translate-y-1"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary dark:text-white vibrancy-primary">
          <HeadingAnchor id={rule.id} as="div">
            {title}
          </HeadingAnchor>
        </CardTitle>
        <div className="flex flex-wrap gap-2 pt-1">
          {rule.pluginName && rule.pluginName !== 'N/A' && (
            <Badge variant="secondary">{rule.pluginName}</Badge>
          )}
          {rule.frontmatter.rule_type &&
            rule.frontmatter.rule_type !== 'suggestion' && (
              <Badge variant="outline">{rule.frontmatter.rule_type}</Badge>
            )}
        </div>
        {description && (
          <CardDescription className="text-primary dark:text-white text-lg pt-2 line-clamp-3 vibrancy-secondary">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="markdown-content prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            [rehypeHighlight, { detect: true, ignoreMissing: true }],
            rehypeRaw,
          ]}
          components={{
            // Custom styling for different markdown elements
            h1: ({ children }) => (
              <HeadingAnchor
                id={slugify(String(children))}
                as="h1"
                className="text-2xl font-bold text-foreground dark:text-white mb-4 mt-6 first:mt-0"
              >
                {children}
              </HeadingAnchor>
            ),
            h2: ({ children }) => (
              <HeadingAnchor
                id={slugify(String(children))}
                as="h2"
                className="text-xl font-semibold text-foreground dark:text-white mb-3 mt-5 first:mt-0"
              >
                {children}
              </HeadingAnchor>
            ),
            h3: ({ children }) => (
              <HeadingAnchor
                id={slugify(String(children))}
                as="h3"
                className="text-lg font-medium text-foreground dark:text-white mb-2 mt-4 first:mt-0"
              >
                {children}
              </HeadingAnchor>
            ),
            p: ({ children }) => (
              <p className="text-muted-foreground dark:text-white mb-3 leading-relaxed">
                {children}
              </p>
            ),
            code: ({ children, className }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground dark:text-white">
                    {children}
                  </code>
                )
              }
              return <code className={className}>{children}</code>
            },
            pre: ({ children }) => (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-base border mb-4">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground dark:text-white">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-muted-foreground dark:text-white">
                {children}
              </li>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-border">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-border bg-muted px-3 py-2 text-left font-medium">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border px-3 py-2">{children}</td>
            ),
            // Handle custom ESLint syntax like ::: incorrect and ::: correct
            div: ({ children, className }) => {
              if (className?.includes('incorrect')) {
                return (
                  <div className="border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 rounded-lg p-4 mb-4">
                    <div className="text-red-700 dark:text-red-300 font-medium mb-2">
                      ❌ Incorrect
                    </div>
                    {children}
                  </div>
                )
              }
              if (className?.includes('correct')) {
                return (
                  <div className="border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 rounded-lg p-4 mb-4">
                    <div className="text-green-700 dark:text-green-300 font-medium mb-2">
                      ✅ Correct
                    </div>
                    {children}
                  </div>
                )
              }
              return <div className={className}>{children}</div>
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="px-0">
          <Link
            href={rule.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm"
          >
            View Official Documentation
            <ExternalLinkIcon className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
