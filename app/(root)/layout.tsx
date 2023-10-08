import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'
import { ThemeProvider } from '@/components/theme-provider';//NOT next-themes!!!
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] }); // font

export const metadata = {
  title: 'NextJs 13',
  description: 'A NextJs 13 app'
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
            <section className='flex min-h-screen flex-1 flex-col items-center  px-6 pb-10 pt-28 max-md:pb-32 sm:px-10 overflow-hidden'>
              <div className='w-full '>
                {children}
              </div>
            </section>

          </main>
          <Bottombar />
        </ThemeProvider>
        <Toaster />
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