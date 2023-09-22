import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'

const inter = Inter({ subsets: ['latin'] }); // font

export const metadata = {
  title: 'Threads',
  description: 'A NextJs 13 meta thread app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        <main className='flex flex-row'>
          <LeftSidebar />
          <section className='main-container'>
            <div className='w-full max-w-4xl'>
              {children}
            </div>
          </section>
          <RightSidebar />
        </main>
        <Bottombar />
      </body>
    </html>
  )
}
