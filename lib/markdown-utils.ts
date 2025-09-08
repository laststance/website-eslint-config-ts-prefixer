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

export function removeInitialDescription(
  content: string,
  description: string,
): string {
  if (!description) return content

  // Split content into lines
  const lines = content.split('\n')
  let startIndex = 0
  let foundDescription = false

  // Look for the description in the content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines, headings, and frontmatter
    if (!line || line.startsWith('#') || line === '---') {
      continue
    }

    // Check if this line matches the description
    if (line === description || line.includes(description.substring(0, 50))) {
      foundDescription = true
      startIndex = i + 1
      break
    }

    // If we've encountered substantial content that doesn't match, stop looking
    if (line.length > 20) {
      break
    }
  }

  // If description was found, remove it and return the rest
  if (foundDescription) {
    // Skip any empty lines after the description
    while (startIndex < lines.length && !lines[startIndex].trim()) {
      startIndex++
    }
    return lines.slice(startIndex).join('\n')
  }

  return content
}
