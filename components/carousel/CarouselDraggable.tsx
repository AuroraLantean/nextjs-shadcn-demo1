"use client"
import { DragonT, dragons } from "@/constants/site_data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BasicModal from "../modal/basicModal";

const CARD_WIDTH = 350;
const CARD_HEIGHT = 350;
const MARGIN = 20;
//TODO: use md:xyz to set the carousel width
export const CarouselDraggable = () => {
  //const [ref, { width }] = useMeasure();ref={ref} 
  //console.log("width=" + width)
  const [leftLimit, setLeftLimit] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    //console.log(carousel.current?.scrollWidth, carousel.current?.offsetWidth);
    if (carousel.current?.scrollWidth) setLeftLimit(carousel.current?.scrollWidth - carousel.current?.offsetWidth)
  }, []);

  //relative max-auto
  return (
    <section className="overflow-hidden my-2">
      <div className="w-full md:w-auto max-w-6xl">
        <p className="text-2xl font-semibold">
          Mystical Creatures... <span className="text-slate-500">Even beyond your imagination</span>
        </p>
        <motion.div ref={carousel} className="my-2 " whileHover={{ cursor: "grab" }} whileTap={{ cursor: "grabbing" }}>
          <motion.div drag="x"
            dragConstraints={{ right: 0, left: - leftLimit - (CARD_WIDTH / 8) }}
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
        width: CARD_WIDTH,
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