import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'eslint-config-ts-prefixer Documentation',
  description: 'Documentation for eslint-config-ts-prefixer',
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
          defaultTheme="light"
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
          <Header />
          <div className="relative z-0">{children}</div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
