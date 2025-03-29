import type { Metadata } from 'next'
import './globals.css'
import { Raleway } from 'next/font/google'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: 'FB marketplace analyzer',
  description: 'use AI to analyze your FB marketplace',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <body>{children}</body>
    </html>
  )
}
