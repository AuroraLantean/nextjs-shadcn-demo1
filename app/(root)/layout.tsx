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
/* import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/wagmi/react'
import { WagmiConfig, createConfig, mainnet as wagmiMainnet } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECTID || 'invalid walletconnect project id'
console.log("NEXT_PUBLIC_WALLETCONNECT_PROJECTID:", projectId)
if (!projectId) {
  throw new Error('WALLETCONNECT_PROJECT_ID not set')
}

const chains = [mainnet, arbitrum]
const wagmiMetadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: wagmiMainnet,
    transport: http(),
  }),
})
//const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata: wagmiMetadata })

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#00DCFF',
    '--w3m-color-mix-strength': 20
  }
}) */

const inter = Inter({ subsets: ['latin'] }); // font

export const metadata = {
  title: 'NextJs 13.5 + Shadcn UI',
  description: 'NextJs 13.5'
}

export default function RootLayout({
  children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className={inter.className}>

        <TanstackProvider>
          <NextThemeProvider attribute="class"
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