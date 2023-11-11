"use client"
import { APP_WIDTH_MIN, DragonT, chainTypeDefault, extractNftIds, nftIdMax, nftIdMin } from "@/constants/site_data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BasicModal from "../modal/basicModal";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { changeChainType, initializeDefaultProvider, initializeWallet, updateChain, updateNftStatus, useWeb3Store, updateAccount, removeAccount, setupBlockchainData, blockchain, getCurrBalances } from "@/store/web3Store";
import { useShallow } from 'zustand/react/shallow'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { capitalizeFirst, delayFunc } from "@/lib/utils";

const CARD_HEIGHT = 350;
const MARGIN = 20;
//TODO: https://sepolia.etherscan.io/tx/TXNHASH

export const CarouselDraggable = () => {
  const compoName = 'CarouselDraggable'
  const lg = console.log;
  //const [ref, { width }] = useMeasure();ref={ref} 
  //lg("width=" + width)
  const [leftLimit, setLeftLimit] = useState(0);
  //const [mesg, setMesg] = useState('');
  const carousel = useRef<HTMLDivElement>(null);
  const effectRan = useRef(false)
  const { toast } = useToast();
  const { disconnect } = useDisconnect()

  const { chainType, account, isInitialized, isDefaultProvider, nftArray, nftStatuses, prices, baseURI, chainName, previousChain, nativeAssetName, nativeAssetSymbol, tokenName, tokenSymbol, nftOriginalOwner, tokenAddr, nftAddr, salesAddr, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  //TODO: disconnect then reconnect => should auto check balances
  //lg(compoName + '... effectRan.current:', effectRan.current, ' isDefaultProvider:', isDefaultProvider)
  //lg(compoName+ ' account:', account, "nftStatuses:", nftStatuses)
  useEffect(() => {
    lg(compoName + " useEffect runs, blockchain:", blockchain)
    if (blockchain || effectRan.current === true) {
      //lg(carousel.current?.scrollWidth, carousel.current?.offsetWidth);
      if (carousel.current?.scrollWidth) setLeftLimit(carousel.current?.scrollWidth - carousel.current?.offsetWidth);

      // fetch nftArray
      const initDefaultProvider = async () => {
        lg(compoName + " useEffect runs initDefaultProvider")
        disconnect();
        const chainType = chainTypeDefault;
        const initOut = await initializeDefaultProvider(chainType);
        if (initOut.err) {
          toast({ description: `Failed: ${JSON.stringify(initOut.err)}`, variant: 'destructive' })
          return true;
        }
        if (initOut.warn) {
          toast({ description: `Failed: ${JSON.stringify(initOut.warn)}`, variant: 'destructive' })
          return true;
        }
        const out = await setupBlockchainData(nftIdMin, nftIdMax, chainType, initOut.chainName);
        if (out.err) {
          toast({ description: `${out.err}`, variant: 'destructive' })
          return;
        }

        toast({ description: "web3 initialized with the DefaultProvider on " + capitalizeFirst(initOut.chainName) });
        lg("initOut:", initOut)
      }
      if (isDefaultProvider) {
        lg("isDefaultProvider already true")
      } else {
        initDefaultProvider();
      }
    }
    return () => {
      lg(compoName + " unmounted useEffect()...")
      effectRan.current = true
    }
  }, []);

  const { chain, chains } = useNetwork()
  useEffect(() => {
    //this chain IS onConnect! could cause loop! https://wagmi.sh/react/hooks/useNetwork
    if (chain && chain.name && chain?.id) {
      //lg(`Wagmi() useNetwork(): ${chain.name}, chainId: ${chain.id}, previousChain: ${previousChain}`)
      //NOT run useState as it will cause loop rendering!
      const { decimals: nativeAssetDecimals, name: nativeAssetName, symbol: nativeAssetSymbol } = chain.nativeCurrency;

      //if (previousChain !== chain.name) {
      const run = async () => {
        await delayFunc(3000);//for previousChain to set
        const out1 = await updateChain(chainType, chain.name, chain.id, nativeAssetName, nativeAssetSymbol, nativeAssetDecimals)

        const out = await setupBlockchainData(nftIdMin, nftIdMax, chainType, chain.name);
        if (out.err) {
          toast({ description: `${out.err}`, variant: 'destructive' })
          return;
        }
      }
      run();
    }
    return () => {
      lg(compoName + " unmounted useEffect[chain.name]...")
    }
  }, [chain?.name]);

  const accountRB = useAccount({
    onConnect({ address, connector, isReconnected }) {
      lg('Wagmi useAccount onConnect', address, connector, ', isReconnected:', isReconnected)
      //connector has onAccountChanged, onChainChanged
      if (address) {
        const run = async () => {
          await updateAccount(chainType, address)

          await delayFunc(2000);//wait for state management to update the data to be used below
          const balcs = await getCurrBalances(chainType, address, tokenAddr, nftAddr, salesAddr);
          if (balcs.err) {
            console.error("balcs.err:", balcs.err)
            toast({ description: `${balcs.err}`, variant: 'destructive' })
            return;
          }

          lg('nftOriginalOwner:', nftOriginalOwner)
          const statuses = await updateNftStatus(chainType, address, nftOriginalOwner, nftAddr, salesAddr, nftIdMin, nftIdMax);
          if (statuses.err) {
            console.error("updateNftStatus err:", statuses.err)
            return;
          }
          lg("statuses:", statuses.arr)
        }
        run();
      }
    },
    onDisconnect() {
      console.log('Account disconnected')
      removeAccount()
    },
  })

  const connectToWallet = async () => {
    lg("connectToWallet")
    if (isInitialized) {
      lg("already initialized")
      toast({ description: "web3 already initialized" });
    } else {
      const initOut = await initializeWallet('evm');
      if (initOut.err) {
        toast({ description: `Failed: ${JSON.stringify(initOut.err)}`, variant: 'destructive' })
        return true;
      }
      if (initOut.warn) {
        toast({ description: `Failed: ${JSON.stringify(initOut.warn)}`, variant: 'destructive' })
        return true;
      }
      toast({ description: "web3 initialized successfully!" });
      lg("initOut:", initOut)
    }
  }
  const changeChainTypeF = async () => {
    lg("changeChainType")
    const initOut = await changeChainType('newChainType');
    if (initOut.err) {
      toast({ description: `Failed: ${JSON.stringify(initOut.err)}`, variant: 'destructive' })
      return true;
    }
    if (initOut.warn) {
      toast({ description: `Failed: ${JSON.stringify(initOut.warn)}`, variant: 'destructive' })
      return true;
    }
    toast({ description: "ChainType changed to ..." });
    lg("initOut:", initOut)

  }
  /* {isInitialized ? <p>Wallet Connected</p> : <Button className="primary-color ml-2"
    onClick={connectToWallet}>Connect to wallet</Button>}

    {effectRan.current ? address && <p>Address: {address} </p> : null}
    */
  //relative max-auto <w3m-button />
  return (
    <section className="overflow-hidden my-2">
      <div className="w-full md:w-auto max-w-6xl">
        <div className="text-2xl font-semibold flex flex-wrap items-center ">
          <span className="mr-2">Mystical Creatures...</span>
          <ConnectButton />
          <Button
            className="!bg-logout-btn ml-2"
            onClick={changeChainTypeF}>Change Chain Type</Button>
          {chain && chain.name.toLowerCase() !== blockchain ? <span className="text-logout-btn">Connected chain is not expected! Click on the Network dropdown button, and click on {capitalizeFirst(blockchain)}. Click on your account dropdown, then click on Disconnect. Then connect wallet again.</span> : null}
        </div>
        <motion.div ref={carousel} className="my-2 " whileHover={{ cursor: "grab" }} whileTap={{ cursor: "grabbing" }}>
          <motion.div drag="x"
            dragConstraints={{ right: 0, left: - leftLimit - (APP_WIDTH_MIN * 6.3) }}
            className="flex flex-row">
            {nftArray.map((nft, index) => {
              return (
                <motion.div className="" key={nft.id}>
                  <Card {...nft} index={index} status={nftStatuses[index]} nativeAssetSymbol={nativeAssetSymbol} tokenSymbol={tokenSymbol} prices={prices}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
/**
animate={{ x: 250 }}
<Image src={item.imgURL} alt="image_alt" width={CARD_WIDTH} height={CARD_HEIGHT} />
*/
type CardProps = {
  index: number, status: string, nativeAssetSymbol: string, tokenSymbol: string, prices: string[]
} & DragonT;
const Card = ({ id, imgURL, category, name, description, index, status, nativeAssetSymbol, tokenSymbol, prices }: CardProps) => {
  const compoName = 'Carousel Card'
  //const index = nftIds.indexOf(nftId);
  const priceOne = prices[index];
  let priceNative = '', priceToken = '';
  if (priceOne) {
    priceNative = priceOne.split('_')[0];
    priceToken = priceOne.split('_')[1].replace('.0', '');
    //lg('index:', index, ', priceOne:', priceOne, priceNative, priceToken)
  }
  //lg("Card: ", nftStatuses[index])
  //lg("Card: ", status)
  //bg-gradient-to-b from-black/90 via-black/60 to-black/0 transition-[backdrop-filter]bg-white
  return (
    <div
      className="relative shrink-0 rounded-2xl  shadow-md transition-all hover:scale-[1.025] hover:shadow-xl"
      style={{
        width: APP_WIDTH_MIN,
        height: CARD_HEIGHT,
        marginRight: MARGIN,
        backgroundImage: `url(${imgURL})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 z-20 rounded-2xl p-6">
        <div>
          <span className="text-xs font-semibold uppercase text-violet-300 bg-dark-2">
            {category}
          </span>
          <p className="my-2 text-3xl font-bold bg-dark-2  w-min">{name}</p>
          <p className="text-lg text-slate-300 bg-dark-2 w-min">{description}</p>
        </div>

        <div className="absolute bottom-0 left-0 flex">
          <BasicModal nftId={id} priceNative={priceNative} priceToken={priceToken} />
          <div className="text-slate-300 bg-dark-2 ">
            <p className="">Price:
              <span className='ml-2 mr-1'>{priceNative}</span>{nativeAssetSymbol} /
              <span className=''> {priceToken} </span>
              {tokenSymbol}
            </p>
            <p className="text-dark-4 bg-secondary-500 w-min">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};