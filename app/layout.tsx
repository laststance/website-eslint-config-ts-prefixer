import type React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ESLint Rules Documentation',
  description:
    'Comprehensive documentation for ESLint rules, dynamically fetched from CSV.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 -z-50">
            <img
              src="/images/background.jpg"
              alt="Scenic background of green grass and blue sky"
              className="object-cover w-full h-full filter blur-[2px] brightness-75"
            />
          </div>
          <div className="relative z-0">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
