# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prettier` - Format all files with Prettier
- `node fetch-eslint-docs.js` - Fetch ESLint rule documentation from GitHub

## Project Architecture

This is a Next.js application that displays ESLint rule documentation. The app reads markdown files from the local `rules/` directory and displays them in a searchable interface with theme support.

### Key Components

- **Main Page (`app/page.tsx`)**: Server-side component that reads markdown files from `rules/` directory, parses frontmatter, and renders the documentation interface
- **RuleCard (`components/rule-card.tsx`)**: Displays individual ESLint rule information with external documentation links
- **RulesSidebar (`components/rules-sidebar.tsx`)**: Navigation sidebar for browsing rules
- **ThemeToggle (`components/theme-toggle.tsx`)**: Theme switcher positioned in top-right corner
- **EslintRule Type (`lib/types.ts`)**: TypeScript interface defining rule structure

### Data Flow

1. Markdown files in `rules/` directory are read at build time using gray-matter for frontmatter parsing
2. Filenames are parsed to extract plugin names and rule names (e.g., `typescript-eslint_no-unused-vars.md`)
3. Rules are transformed into `EslintRule` objects with generated documentation URLs
4. Components render the structured rule data with links to official documentation

### Rule Documentation Fetcher

The `fetch-eslint-docs.js` script uses GitHub's API (@octokit/rest) to fetch actual rule documentation from various repositories and save them as markdown files in the `rules/` directory:

- Built-in ESLint rules from `eslint/eslint`
- TypeScript ESLint rules from `typescript-eslint/typescript-eslint`
- Import plugin rules from `import-js/eslint-plugin-import`
- Prettier plugin from `prettier/eslint-plugin-prettier`

### Rule File Naming Convention

Rule files follow the pattern: `{plugin-name}_{rule-name}.md` or `{rule-name}.md` for built-in rules:

- Built-in: `eqeqeq.md`, `no-unused-vars.md`
- TypeScript: `typescript-eslint_no-unused-vars.md`, `typescript-eslint_prefer-as-const.md`
- Import: `import_order.md`, `import_no-cycle.md`

### UI Framework

- Built with shadcn/ui components and Radix UI primitives
- Uses Tailwind CSS for styling with dark/light theme support via next-themes (defaults to light)
- Theme toggle positioned in top-right corner using fixed positioning
- Responsive design with mobile-first approach and backdrop blur effects

### Configuration Notes

- ESLint and TypeScript errors are ignored during builds (configured in `next.config.mjs`)
- Uses Volta for Node.js version management (22.16.0)
- Prettier formatting is enforced via lint-staged and Husky pre-commit hooks
- Images are unoptimized for static deployment compatibility
