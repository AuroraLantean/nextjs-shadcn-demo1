import { cn } from "@/lib/utils"
import { BoxT } from "@/types";

const BoxCard = ({ id, title, available, total, interest, compo_addr, status, detail_link, img_link, fixed_price, bid_price, votes }: BoxT) => {
  //bg-gradient-to-b from-black/90 via-black/60 to-black/0 transition-[backdrop-filter]bg-white
  return (
    <div className="my-2 text-slate-300">
      <p className="">id: {id}, title: {title}, available: {available}, total: {total}, status: {status}</p>
      <p>interest: {interest}, fixed_price: {fixed_price}, bid price: {bid_price}, votes: {votes}</p>
    </div>
  );
};
export default BoxCard;
/**
      <p>compo_addr:{compo_addr}</p>
 */