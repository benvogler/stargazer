import './globals.css'
import type { Metadata } from 'next'
import { Major_Mono_Display } from 'next/font/google'

const major = Major_Mono_Display({
  weight: '400',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Stargazer Station - ATC Terminal',
  description: 'Stargazer Station - ATC Terminal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={major.className + ' lowercase text-shadow-sm shadow-sky-950 text-sky-600 tracking-tighter font-bold'}>{children}</body>
    </html>
  )
}
