import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'
import { Toaster } from "@/components/ui/toaster"
import TanstackProvider from '@/components/providers/TanstackProvider'
import { NextThemeProvider } from '@/components/providers/NextThemeProvider';//NOT next-themes!!!
import { RainbowKitProviders } from '@/components/providers/RainbowKitProvider'
import '@rainbow-me/rainbowkit/styles.css';

const inter = Inter({ subsets: ['latin'] }); // font

export const metadata = {
  title: 'NextJs 14 + Shadcn UI',
  description: 'NextJs 14 Shadcn UI TailwindCSS TypeScript'
}

export default function RootLayout({
  children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body
        //suppressHydrationWarning={true}
        className={inter.className}>

        <TanstackProvider>
          <NextThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange >
            <RainbowKitProviders>
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
            </RainbowKitProviders>
          </NextThemeProvider>
        </TanstackProvider>

        <Toaster />
      </body>
    </html>
  )
}
{/* <WagmiConfig config={wagmiConfig}>
{children}
</WagmiConfig>
 */}
// max-w-4xl  <RightSidebar />
/* Add suppressHydrationWarning after development!
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange >
          
*/