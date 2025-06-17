// Utility functions for processing markdown content

export function processEslintMarkdown(content: string): string {
  // Handle ESLint-specific syntax like ::: incorrect and ::: correct blocks
  let processedContent = content

  // Process ::: incorrect blocks
  processedContent = processedContent.replace(
    /::: incorrect\s*\n([\s\S]*?)\n:::/g,
    (match, blockContent) => {
      return `<div class="eslint-block incorrect">

${blockContent.trim()}

</div>`
    },
  )

  // Process ::: correct blocks
  processedContent = processedContent.replace(
    /::: correct\s*\n([\s\S]*?)\n:::/g,
    (match, blockContent) => {
      return `<div class="eslint-block correct">

${blockContent.trim()}

</div>`
    },
  )

  // Handle standalone ::: incorrect and ::: correct without content
  processedContent = processedContent.replace(/::: incorrect\s*$/gm, '')
  processedContent = processedContent.replace(/::: correct\s*$/gm, '')
  processedContent = processedContent.replace(/^\s*:::\s*$/gm, '')

  // Handle TypeScript ESLint specific syntax for code blocks with options
  processedContent = processedContent.replace(
    /```ts option='([^']+)' showPlaygroundButton\s*\n([\s\S]*?)\n```/g,
    (match, option, code) => {
      return `<div class="code-block-with-option">
<div class="code-option">${option}</div>

\`\`\`ts
${code.trim()}
\`\`\`
</div>`
    },
  )

  // Handle code blocks with just options
  processedContent = processedContent.replace(
    /```ts option='([^']+)'\s*\n([\s\S]*?)\n```/g,
    (match, option, code) => {
      return `<div class="code-block-with-option">
<div class="code-option">${option}</div>

\`\`\`ts
${code.trim()}
\`\`\`
</div>`
    },
  )

  return processedContent
}

export function extractRuleDescription(content: string): string {
  // Extract the first paragraph as description
  const lines = content.split('\n')
  let description = ''

  for (const line of lines) {
    const trimmed = line.trim()
    // Skip empty lines, headings, and frontmatter separators
    if (!trimmed || trimmed.startsWith('#') || trimmed === '---') {
      continue
    }
    // Take the first substantial paragraph
    if (trimmed.length > 20) {
      description = trimmed
      break
    }
  }

  return description
}
