"use client"
import { APP_WIDTH_MIN, DragonT, nftIdMax, nftIdMin } from "@/constants/site_data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BasicModal from "../modal/basicModal";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { initializeWallet, updateNftArray, useWeb3Store } from "@/store/web3Store";
import { useShallow } from 'zustand/react/shallow'

const CARD_HEIGHT = 350;
const MARGIN = 20;
//TODO: make mobile carousel work without difficulty... reference: commit before Sep 29
//TODO: button to refresh token sales status
//TODO: check buying ETH/Token amount
export const CarouselDraggable = () => {
  const lg = console.log;
  const compoName = 'CarouselDraggable'
  lg(compoName)
  //const [ref, { width }] = useMeasure();ref={ref} 
  //lg("width=" + width)
  const [leftLimit, setLeftLimit] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const effectRan = useRef(false)
  const { toast } = useToast();

  const { isInitialized, nftArray, nftStatuses, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  //lg(compoName + " nftStatuses:", nftStatuses)
  useEffect(() => {
    if (effectRan.current === true) {
      lg(compoName + " useEffect ran")
      //lg(carousel.current?.scrollWidth, carousel.current?.offsetWidth);
      if (carousel.current?.scrollWidth) setLeftLimit(carousel.current?.scrollWidth - carousel.current?.offsetWidth);

      // fetch nftArray
      const action = async () => {
        const nftsOut = await updateNftArray(nftIdMin, nftIdMax);
        if (nftsOut.err) {
          console.error("nftsOut.err:", nftsOut.err)
          toast({ description: `${nftsOut.err}`, variant: 'destructive' })
          return;
        }
      }
      action();
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
          Mystical Creatures... <span className="text-slate-500">Even beyond your imagination.</span>
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
                  <Card {...nft} index={index} status={nftStatuses[index]} />
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
const Card = ({ id, price, imgURL, category, name, description, index, status }: DragonT & { index: number, status: string }) => {
  /*   const { nftStatuses } = useWeb3Store(
      useShallow((state) => ({ ...state }))
    ) 
    console.log("CarouselDraggable Card: ", nftStatuses[index])*/
  //console.log("CarouselDraggable Card: ", status)
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

        <div className="absolute bottom-0 left-0"><BasicModal nftId={id} price={price} /> <span className="text-lg text-slate-300 bg-secondary-500 w-min">{status}</span></div>
      </div>

    </div>
  );
};