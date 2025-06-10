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

This is a Next.js application that displays ESLint rule documentation. The app fetches rule data from a CSV file hosted on Vercel Blob Storage and displays it in a searchable interface.

### Key Components

- **Main Page (`app/page.tsx`)**: Fetches ESLint rules from CSV URL and renders the documentation interface
- **RuleCard (`components/rule-card.tsx`)**: Displays individual ESLint rule information with external documentation links
- **RulesSidebar (`components/rules-sidebar.tsx`)**: Navigation sidebar for browsing rules
- **EslintRule Type (`lib/types.ts`)**: TypeScript interface defining rule structure

### Data Flow

1. CSV data is fetched from Vercel Blob Storage containing plugin names, rule names, and documentation URLs
2. Rules are parsed and transformed into `EslintRule` objects with generated IDs
3. Components render the structured rule data with links to official documentation

### Rule Documentation Fetcher

The `fetch-eslint-docs.js` script uses GitHub's API to fetch actual rule documentation from various repositories:

- Built-in ESLint rules from `eslint/eslint`
- TypeScript ESLint rules from `typescript-eslint/typescript-eslint`
- Import plugin rules from `import-js/eslint-plugin-import`
- Prettier plugin from `prettier/eslint-plugin-prettier`

### UI Framework

- Built with shadcn/ui components and Radix UI primitives
- Uses Tailwind CSS for styling with dark mode support via next-themes
- Responsive design with mobile-first approach

### Configuration Notes

- ESLint and TypeScript errors are ignored during builds (configured in `next.config.mjs`)
- Uses Volta for Node.js version management (22.16.0)
- Prettier formatting is enforced via lint-staged and Husky pre-commit hooks
