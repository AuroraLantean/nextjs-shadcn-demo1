"use client"
import { DragonT, dragons } from "@/constants/site_data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase ">
          Scroll down
        </span>
      </div>



      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase ">
          Scroll up
        </span>
      </div>
 */
export const HorizontalScrollCarousel = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] ">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {dragons.map((item) => {
            return <Card item={item} key={item.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ item }: { item: DragonT }) => {
  return (
    <div
      key={item.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${item.imgURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {item.name}
        </p>
      </div>
    </div>
  );
};