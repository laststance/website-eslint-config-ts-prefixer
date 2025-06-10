import { RulesSidebar } from '@/components/rules-sidebar'
import { RuleCard } from '@/components/rule-card'
import { ThemeToggle } from '@/components/theme-toggle'
import type { EslintRule } from '@/lib/types'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

async function getEslintRules(): Promise<EslintRule[]> {
  try {
    const rulesDirectory = path.join(process.cwd(), 'rules')
    const filenames = fs.readdirSync(rulesDirectory)
    const markdownFiles = filenames.filter((name) => name.endsWith('.md'))

    const rules: EslintRule[] = markdownFiles.map((filename) => {
      const filePath = path.join(rulesDirectory, filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data: frontmatter, content } = matter(fileContent)

      // Parse plugin name and rule name from filename
      // Examples: eqeqeq.md, typescript-eslint_consistent-type-imports.md, import_order.md
      const nameWithoutExtension = filename.replace('.md', '')
      let pluginName = 'Built-in'
      let ruleName = nameWithoutExtension

      if (nameWithoutExtension.includes('_')) {
        const parts = nameWithoutExtension.split('_')
        pluginName = parts[0]
        ruleName = parts.slice(1).join('/')
      }

      // Map plugin names to display names
      const pluginDisplayNames: { [key: string]: string } = {
        'typescript-eslint': '@typescript-eslint',
        import: 'eslint-plugin-import',
      }

      const displayPluginName = pluginDisplayNames[pluginName] || pluginName

      // Generate documentation URL (could be made more sophisticated)
      let documentationUrl = '#'
      if (pluginName === 'Built-in') {
        documentationUrl = `https://eslint.org/docs/latest/rules/${ruleName}`
      } else if (pluginName === 'typescript-eslint') {
        documentationUrl = `https://typescript-eslint.io/rules/${ruleName}`
      } else if (pluginName === 'import') {
        documentationUrl = `https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/${ruleName}.md`
      }

      return {
        pluginName: displayPluginName,
        ruleName,
        documentationUrl,
        id: nameWithoutExtension.replace(/[^a-zA-Z0-9-_/]/g, '-').toLowerCase(),
        content,
        frontmatter,
      }
    })

    // Sort rules by custom plugin order: Built-in < eslint-plugin-import < @typescript-eslint
    const pluginOrder = [
      'Built-in',
      'eslint-plugin-import',
      '@typescript-eslint',
    ]

    return rules.sort((a, b) => {
      if (a.pluginName !== b.pluginName) {
        const orderA = pluginOrder.indexOf(a.pluginName)
        const orderB = pluginOrder.indexOf(b.pluginName)
        return orderA - orderB
      }
      return a.ruleName.localeCompare(b.ruleName)
    })
  } catch (error) {
    console.error('Error reading ESLint rule files:', error)
    return []
  }
}

export default async function EslintDocsPage() {
  const rules = await getEslintRules()

  if (!rules.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert
          variant="destructive"
          className="max-w-lg bg-card/80 backdrop-blur-sm"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Rules</AlertTitle>
          <AlertDescription>
            Failed to load ESLint rules. The data source might be unavailable or
            there was an issue parsing the data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative">
      <header className="fixed top-0 right-0 z-50 p-4">
        <ThemeToggle />
      </header>
      <div className="md:flex">
        <RulesSidebar rules={rules} />
        <main className="flex-1 p-6 md:p-10 space-y-8 md:ml-72 min-h-screen">
          <div className="max-w-4xl mx-auto">
            {' '}
            {/* Content constraint */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-10 mt-4 md:mt-0">
              ESLint Rules Documentation
            </h1>
            <section className="flex flex-col gap-4">
              {rules.map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
