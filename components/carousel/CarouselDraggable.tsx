"use client"
import { APP_WIDTH_MIN, DragonT, chainTypeDefault, extractNftIds, nftIdMax, nftIdMin } from "@/constants/site_data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BasicModal from "../modal/basicModal";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { getBaseURI, getSalesPrices, initializeDefaultProvider, initializeWallet, updateAddrs, updateNftArray, updateNftStatus, useWeb3Store } from "@/store/web3Store";
import { useShallow } from 'zustand/react/shallow'

const CARD_HEIGHT = 350;
const MARGIN = 20;
const lg = console.log;
//TODO: make mobile carousel work without difficulty... reference: commit before Sep 29
export const CarouselDraggable = () => {
  const lg = console.log;
  const compoName = 'CarouselDraggable'
  //const [ref, { width }] = useMeasure();ref={ref} 
  //lg("width=" + width)
  const [leftLimit, setLeftLimit] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const effectRan = useRef(false)
  const { toast } = useToast();

  const { account, isInitialized, isDefaultProvider, nftArray, nftStatuses, prices, baseURI, nativeAssetName, tokenName, tokenSymbol, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  //lg(compoName, ', account:', account, "nftStatuses:", nftStatuses)
  useEffect(() => {
    if (effectRan.current === true) {
      lg(compoName + " useEffect ran")
      //lg(carousel.current?.scrollWidth, carousel.current?.offsetWidth);
      if (carousel.current?.scrollWidth) setLeftLimit(carousel.current?.scrollWidth - carousel.current?.offsetWidth);

      // fetch nftArray
      const action = async () => {
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
        toast({ description: "web3 initialized with the DefaultProvider!" });
        lg("initOut:", initOut)

        const nftsOut = await updateNftArray(nftIdMin, nftIdMax);
        if (nftsOut.err) {
          console.error("nftsOut.err:", nftsOut.err)
          toast({ description: `${nftsOut.err}`, variant: 'destructive' })
          return;
        }

        const { nftAddr, salesAddr, nftOriginalOwner, err: updateAddrsErr } = await updateAddrs(chainType);
        if (updateAddrsErr) {
          console.error("updateAddrsErr:", updateAddrsErr)
          toast({ description: `${updateAddrsErr}`, variant: 'destructive' })
          return;
        }

        const out2 = await getSalesPrices(chainType, nftsOut.nftIds, nftAddr, salesAddr);
        if (out2.err) {
          console.error("getSalesPrices err:", out2.err)
          toast({ description: `${out2.err}`, variant: 'destructive' })
          return;
        }
        await getBaseURI(chainType, nftAddr);

        const statuses = await updateNftStatus(chainType, account, nftOriginalOwner, nftAddr, salesAddr, nftIdMin, nftIdMax);
        if (statuses.err) {
          console.error("updateNftStatus err:", statuses.err)
          toast({ description: `${statuses.err}`, variant: 'destructive' })
          return;
        }
        lg("statuses:", statuses.arr)
      }
      if (isDefaultProvider) {
        lg("isDefaultProvider already true")
      } else {
        action();
      }
    }
    return () => {
      lg(compoName + " unmounted useeffect()...")
      effectRan.current = true
    }
  }, []);

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

  //relative max-auto <w3m-button />
  return (
    <section className="overflow-hidden my-2">
      <div className="w-full md:w-auto max-w-6xl">
        <div className="text-2xl font-semibold flex">
          Mystical Creatures... <span className="ml-2 text-slate-500">Even beyond your imagination.</span>
          {isInitialized ? <p>Wallet Connected</p> : <Button
            className="primary-color ml-2"
            onClick={connectToWallet}>Connect to wallet</Button>}

        </div>
        <motion.div ref={carousel} className="my-2 " whileHover={{ cursor: "grab" }} whileTap={{ cursor: "grabbing" }}>
          <motion.div drag="x"
            dragConstraints={{ right: 0, left: - leftLimit - (1 / 1) }}
            className="flex flex-row">
            {nftArray.map((nft, index) => {
              return (
                <motion.div className="" key={nft.id}>
                  <Card {...nft} index={index} status={nftStatuses[index]} nativeAssetName={nativeAssetName} tokenName={tokenName} tokenSymbol={tokenSymbol} prices={prices}
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
  index: number, status: string, nativeAssetName: string, tokenName: string, tokenSymbol: string, prices: string[]
} & DragonT;
const Card = ({ id, imgURL, category, name, description, index, status, nativeAssetName, tokenName, tokenSymbol, prices }: CardProps) => {
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
              <span className='ml-2 mr-1'>{priceNative}</span>{nativeAssetName} /
              <span className=''> {priceToken} </span>
              {tokenSymbol}
            </p>
            <p className="text-slate-300 bg-secondary-500 w-min">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};