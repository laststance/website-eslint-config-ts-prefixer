import { RulesSidebar } from '@/components/rules-sidebar'
import { RuleCard } from '@/components/rule-card'
import { Header } from '@/components/header'
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
      <Header />
      <div className="md:flex pt-16">
        <RulesSidebar rules={rules} />
        <main className="flex-1 p-6 md:p-10 space-y-8 md:ml-72 min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <section className="mb-12">
              <h1 className="text-black dark:text-white text-4xl md:text-5xl font-bold mb-4">
                eslint-config-ts-prefixer
              </h1>
              <p className="text-black dark:text-gray-300 text-lg md:text-xl mb-8">
                A zero-config TypeScript ESLint configuration with Prettier
                integration
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#installation"
                  className="inline-flex items-center px-5 py-2.5 glass-thin glass-tinted-blue glass-border rounded-glass font-medium glass-transition hover:glass-medium hover:scale-105 vibrancy-primary"
                >
                  Get Started
                </a>
                <a
                  href="https://github.com/laststance/eslint-config-ts-prefixer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 glass-thin glass-border rounded-glass font-medium glass-transition hover:glass-medium hover:scale-105 vibrancy-primary"
                >
                  View on GitHub
                </a>
              </div>
            </section>

            {/* Installation Section */}
            <section
              id="installation"
              className="mb-12 glass-clear glass-dimmed glass-border glass-shadow-sm p-6 rounded-glass-lg"
            >
              <h2 className="text-black dark:text-white text-2xl font-semibold mb-4">
                Installation
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-black dark:text-gray-300 mb-3">
                    Install the package using your preferred package manager:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-black/30 p-3 rounded">
                      <code className="text-green-400">
                        pnpm add -D eslint-config-ts-prefixer@latest
                      </code>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <code className="text-green-400">
                        npm install --save-dev eslint-config-ts-prefixer@latest
                      </code>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <code className="text-green-400">
                        yarn add -D eslint-config-ts-prefixer
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration Section */}
            <section
              id="configuration"
              className="mb-12 glass-clear glass-dimmed glass-border glass-shadow-sm p-6 rounded-glass-lg"
            >
              <h2 className="text-black dark:text-white text-2xl font-semibold mb-4">
                Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-black dark:text-gray-300 mb-3">
                    Add to your{' '}
                    <code className="text-blue-400">eslint.config.js</code>:
                  </p>
                  <div className="bg-black/30 p-4 rounded overflow-x-auto">
                    <pre className="text-gray-200">
                      {`import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'

export default defineConfig([...tsPrefixer])`}
                    </pre>
                  </div>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-300 mb-3">
                    Add lint scripts to your{' '}
                    <code className="text-blue-400">package.json</code>:
                  </p>
                  <div className="bg-black/30 p-4 rounded overflow-x-auto">
                    <pre className="text-gray-200">
                      {`{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Rules Documentation Section */}
            <section>
              <h2 className="text-black dark:text-white text-2xl font-semibold mb-6">
                Configured Rules
              </h2>
              <p className="text-black dark:text-gray-300 mb-6">
                Below is a comprehensive list of all ESLint rules configured by
                this package:
              </p>
              <div className="flex flex-col gap-4">
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
