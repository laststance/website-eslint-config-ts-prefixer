import { RulesSidebar } from '@/components/rules-sidebar'
import { RuleCard } from '@/components/rule-card'
import { CodeBlockWithCopy } from '@/components/code-block-with-copy'
import { PreCodeBlockWithCopy } from '@/components/pre-code-block-with-copy'
import { HeadingAnchor } from '@/components/heading-anchor'
import type { EslintRule } from '@/lib/types'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { env } from '@/lib/env'

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

    const sortedRules = rules.sort((a, b) => {
      if (a.pluginName !== b.pluginName) {
        const orderA = pluginOrder.indexOf(a.pluginName)
        const orderB = pluginOrder.indexOf(b.pluginName)
        return orderA - orderB
      }
      return a.ruleName.localeCompare(b.ruleName)
    })

    // Apply rule limiting based on environment variable
    if (env.NEXT_PUBLIC_LIMIT_RULES === 'third') {
      const limitedCount = Math.ceil(sortedRules.length / 3)
      console.log(
        `[DEV MODE] Limiting rules from ${sortedRules.length} to ${limitedCount} (1/3) to reduce page size`,
      )
      return sortedRules.slice(0, limitedCount)
    }

    if (env.NEXT_PUBLIC_LIMIT_RULES === 'sixth') {
      const limitedCount = Math.ceil(sortedRules.length / 6)
      console.log(
        `[DEV MODE] Limiting rules from ${sortedRules.length} to ${limitedCount} (1/6) to reduce page size`,
      )
      return sortedRules.slice(0, limitedCount)
    }

    if (env.NEXT_PUBLIC_LIMIT_RULES === 'minimal') {
      const limitedCount = 2
      console.log(
        `[DEV MODE] Limiting rules from ${sortedRules.length} to ${limitedCount} (2 rules) for extreme minimal context usage`,
      )
      return sortedRules.slice(0, limitedCount)
    }

    return sortedRules
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
          className="max-w-lg glass-medium glass-border glass-shadow-md rounded-glass-lg"
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
      <div className="lg:flex">
        <RulesSidebar rules={rules} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 lg:ml-auto min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <section className="mb-16 glass-clear glass-border glass-shadow-md p-8 md:p-12 rounded-glass-xl">
              <h1 className="text-gray-950 dark:text-white text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                eslint-config-ts-prefixer
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl mb-10 leading-relaxed font-medium max-w-3xl">
                A zero-config TypeScript ESLint configuration with Prettier
                integration
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#installation"
                  className="group inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-glass-lg font-semibold glass-transition hover:scale-[1.02] hover:shadow-lg text-base"
                >
                  <span className="relative z-10">Get Started</span>
                </a>
                <a
                  href="https://github.com/laststance/eslint-config-ts-prefixer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-glass-lg font-semibold glass-transition hover:scale-[1.02] hover:shadow-lg text-base"
                >
                  <span className="relative z-10">View on GitHub</span>
                </a>
              </div>
            </section>

            {/* Installation Section */}
            <section
              id="installation"
              className="mb-16 glass-clear glass-border glass-shadow-sm p-8 md:p-10 rounded-glass-xl transition-all duration-300 hover:glass-shadow-md"
            >
              <HeadingAnchor
                id="installation"
                as="h2"
                className="text-black dark:text-white text-2xl font-semibold mb-4"
              >
                Installation
              </HeadingAnchor>
              <div className="space-y-4">
                <div>
                  <p className="text-black dark:text-gray-300 mb-3">
                    Install the package using your preferred package manager:
                  </p>
                  <div className="space-y-3">
                    <CodeBlockWithCopy code="pnpm add -D eslint-config-ts-prefixer@latest" />
                    <CodeBlockWithCopy code="npm install --save-dev eslint-config-ts-prefixer@latest" />
                    <CodeBlockWithCopy code="yarn add -D eslint-config-ts-prefixer" />
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration Section */}
            <section
              id="configuration"
              className="mb-16 glass-clear glass-border glass-shadow-sm p-8 md:p-10 rounded-glass-xl transition-all duration-300 hover:glass-shadow-md"
            >
              <HeadingAnchor
                id="configuration"
                as="h2"
                className="text-black dark:text-white text-2xl font-semibold mb-4"
              >
                Configuration
              </HeadingAnchor>
              <div className="space-y-4">
                <div>
                  <p className="text-black dark:text-gray-300 mb-3">
                    Add to your{' '}
                    <code className="text-blue-400">eslint.config.js</code>:
                  </p>
                  <PreCodeBlockWithCopy
                    code={`import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'

export default defineConfig([...tsPrefixer])`}
                  />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-300 mb-3">
                    Add lint scripts to your{' '}
                    <code className="text-blue-400">package.json</code>:
                  </p>
                  <PreCodeBlockWithCopy
                    code={`{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}`}
                  />
                </div>
              </div>
            </section>

            {/* Rules Documentation Section */}
            <section>
              <HeadingAnchor
                id="configured-rules"
                as="h2"
                className="text-black dark:text-white text-2xl font-semibold mb-6"
              >
                Configured Rules
              </HeadingAnchor>
              <p className="text-black dark:text-gray-300 mb-6">
                Below is a comprehensive list of all ESLint rules configured by
                this package:
              </p>
              <div className="flex flex-col gap-8">
                {rules.map((rule) => (
                  <RuleCard key={rule.id} rule={rule} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
