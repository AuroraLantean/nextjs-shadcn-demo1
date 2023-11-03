"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useMeasure from "react-use-measure";
import { DragonT, dragons } from "@/constants/site_data";
import BasicModal from "@/components/modal/basicModal";
import { useWeb3Store } from "@/store/web3Store";
import { useShallow } from 'zustand/react/shallow'

const CARD_WIDTH = 350;
const CARD_HEIGHT = 350;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

const CarouselClickable = () => {
  const { nftStatuses, prices, baseURI, nativeAssetName, tokenName, tokenSymbol, err } = useWeb3Store(
    useShallow((state) => ({ ...state }))
  )
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);

  const CARD_BUFFER =
    width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT =
    Math.abs(offset) < CARD_SIZE * (dragons.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    setOffset((pv) => (pv += CARD_SIZE));
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  return (
    <section className="" ref={ref}>
      <div className="relative overflow-hidden p-4">
        {/* CARDS */}
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-2xl font-semibold">
            Your mind determines <span className="text-slate-500">your success.</span>
          </p>
          <motion.div
            animate={{
              x: offset,
            }}
            className="flex"
          >
            {dragons.map((nft, index) => {
              return <Card key={nft.id} {...nft} index={index} status={nftStatuses[index]} nativeAssetName={nativeAssetName} tokenName={tokenName} tokenSymbol={tokenSymbol} prices={prices} />;
            })}
          </motion.div>
        </div>

        {/* BUTTONS */}
        <>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_LEFT ? "0%" : "-100%",
            }}
            className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-slate-100/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
            onClick={shiftLeft}
          >
            <FiChevronLeft />
          </motion.button>
          <motion.button
            initial={false}
            animate={{
              x: CAN_SHIFT_RIGHT ? "0%" : "100%",
            }}
            className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-slate-100/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
            onClick={shiftRight}
          >
            <FiChevronRight />
          </motion.button>
        </>
      </div>
    </section>
  );
};
//onClick={() => clickCard(id, address)}
const clickCard = (id: number, address: string) => {
  console.log("clickCard... id:", id, ", address:", address);
}
type CardProps = {
  index: number, status: string, nativeAssetName: string, tokenName: string, tokenSymbol: string, prices: string[]
} & DragonT;
const Card = ({ id, imgURL, category, name, description, index, status, nativeAssetName, tokenName, tokenSymbol, prices }: CardProps) => {
  const priceOne = prices[index];
  let priceNative = '', priceToken = '';
  if (priceOne) {
    priceNative = priceOne.split('_')[0];
    priceToken = priceOne.split('_')[1].replace('.0', '');
    //lg('index:', index, ', priceOne:', priceOne, priceNative, priceToken)
  }
  return (
    <div
      className="relative shrink-0 cursor-pointer rounded-2xl bg-white shadow-md transition-all hover:scale-[1.015] hover:shadow-xl"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: MARGIN,
        backgroundImage: `url(${imgURL})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-b from-black/90 via-black/60 to-black/0 p-6 text-white transition-[backdrop-filter] hover:backdrop-blur-sm">
        <span className="text-xs font-semibold uppercase text-violet-300">
          {category}
        </span>
        <p className="my-2 text-3xl font-bold">{name}</p>
        <p className="text-lg text-slate-300">{description}</p>

        <div className="absolute bottom-0 left-0"><BasicModal nftId={id} priceNative={priceNative} priceToken={priceToken} /></div>
      </div>

    </div>
  );
};

export default CarouselClickable;
/*
type DragonT = {
  id: number;
  imgURL: string;
  category: string;
  name: string;
  description: string;
};

const dragons: DragonT[] = [
  {
    id: 1,
    imgURL: "/imgs/computer/mouse.png",
    category: "Mice",
    name: "Just feels right",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
  {
    id: 2,
    imgURL: "/imgs/computer/keyboard.png",
    category: "Keyboards",
    name: "Type in style",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
  {
    id: 3,
    imgURL: "/imgs/computer/monitor.png",
    category: "Monitors",
    name: "Looks like a win",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, dolor.",
  },
];*/
