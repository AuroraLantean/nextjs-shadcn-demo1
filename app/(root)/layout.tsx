import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'
import { ThemeProvider } from '@/components/theme-provider';//NOT next-themes!!!

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
    <html lang="en" >
      <body className={inter.className}>
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange >
          <Topbar />
          <main className='flex flex-row'>
            <LeftSidebar />
            <section className='main-container'>
              <div className='w-full '>
                {children}
              </div>
            </section>

          </main>
          <Bottombar />
        </ThemeProvider>
      </body>
    </html>
  )
}
// max-w-4xl  <RightSidebar />
/* Add suppressHydrationWarning after development!
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange >
          
*/