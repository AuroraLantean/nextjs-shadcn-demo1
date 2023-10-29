"use client"
import { APP_WIDTH_MIN, DragonT, dragons } from "@/constants/site_data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BasicModal from "../modal/basicModal";
import { OutT, bigIntZero, ethersInit, getChainObj } from "@/lib/actions/ethers";
import { useToast } from "../ui/use-toast";
import { capitalizeFirst } from "@/lib/utils";
import { Button } from "../ui/button";
import { initializeWallet, useWeb3Store } from "@/store/web3Store";
import { useShallow } from 'zustand/react/shallow'

const CARD_HEIGHT = 350;
const MARGIN = 20;
//TODO: use md:xyz to set the carousel width
export const CarouselDraggable = () => {
  const lg = console.log;
  //const [ref, { width }] = useMeasure();ref={ref} 
  //lg("width=" + width)
  const [leftLimit, setLeftLimit] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const effectRan = useRef(false)
  const { toast } = useToast();
  const nftOwner = process.env.NEXT_PUBLIC_ETHEREUM_NFTOWNER || '';
  lg('nftOwner', nftOwner);
  let mesg = '';
  //let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
  const { chainType, isInitialized, chainName, chainId, account, isLoadingWeb3, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  useEffect(() => {
    if (effectRan.current === true) {
      lg("CarouselDraggable useEffect ran")
      //lg(carousel.current?.scrollWidth, carousel.current?.offsetWidth);
      if (carousel.current?.scrollWidth) setLeftLimit(carousel.current?.scrollWidth - carousel.current?.offsetWidth);
      if (!nftOwner) {
        mesg = "env nftOwner invalid";
        console.error(mesg)
        toast({ description: mesg });
      }
    }
    return () => {
      lg("CarouselDraggable unmounted useeffect()...")
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
      //const initOut = await ethersInit();
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
          Mystical Creatures... <span className="text-slate-500">Even beyond your imagination.</span>
          {isInitialized ? <p>Wallet Connected</p> : <Button
            className="primary-color ml-2"
            onClick={connectToWallet}>Connect to wallet</Button>}

        </div>
        <motion.div ref={carousel} className="my-2 " whileHover={{ cursor: "grab" }} whileTap={{ cursor: "grabbing" }}>
          <motion.div drag="x"
            dragConstraints={{ right: 0, left: - leftLimit - (1 / 1) }}
            className="flex flex-row">
            {dragons.map((item) => {
              return (
                <motion.div className="" key={item.id}>
                  <Card {...item} />
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
const Card = ({ id, address, price, imgURL, category, name, description }: DragonT) => {
  //
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
      <div className="absolute inset-0 z-20 rounded-2xl p-6 text-white ">
        <span className="text-xs font-semibold uppercase text-violet-300 bg-dark-2">
          {category}
        </span>
        <p className="my-2 text-3xl font-bold bg-dark-2  w-min">{name}</p>
        <p className="text-lg text-slate-300 bg-dark-2 w-min">{description}</p>

        <div className="absolute bottom-0 left-0"><BasicModal id={id} address={address} price={price} /></div>
      </div>

    </div>
  );
};