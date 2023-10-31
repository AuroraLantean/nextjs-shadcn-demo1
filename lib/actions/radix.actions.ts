"use server";
import { revalidatePath } from "next/cache";
import { delayFunc } from "../utils";
import { OutT, bigIntZero } from "./ethers";

let out: OutT = { err: '', str1: '', inWei: bigIntZero, nums: [] }
export const buyNFT = async (nftId: string, address: string, amount: string): Promise<OutT> => {
  console.log("radix.actions.. buyNFT: ", nftId, address, amount)
  try {
    await delayFunc(3000)
    console.log("radix.actions: buyNFT")
    if (Math.random() < 0.2) {
      const hash = "abc123456789";
      return { ...out, str1: hash };
    } else {
      console.log("transaction failed")
      return { ...out, err: "transaction failed" };
      //throw new Error("error 001")
    }
  } catch (error: any) {
    return { ...out, err: `buyNFT failed: ${error.message}` };
  }
}

type TypeMintNFT = {
  address: string
  price: string
  author: string
  path: string
}
export const mintNFT = async ({ address, price, author, path }: TypeMintNFT): Promise<OutT> => {
  try {
    console.log(`${address} - ${price} - ${author} - ${path}`);
    const hash = "abc123456789"
    return { ...out, str1: hash };
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`mintNFT failed: ${error.message}`);
  }
}