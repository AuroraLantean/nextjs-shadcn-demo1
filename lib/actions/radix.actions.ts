"use server";
import { revalidatePath } from "next/cache";
import { delayFunc } from "../utils";

type TypeBuyNFT = {
  nftId: string
  address: string
  amount: string
}
export const buyNFT = async ({ nftId, address, amount }: TypeBuyNFT) => {
  console.log("radix.actions.. buyNFT: ", nftId, address, amount)
  try {
    await delayFunc(3000)
    console.log("radix.actions: buyNFT")
    if (Math.random() < 0.5) {
      const hash = "abc123456789";
      return { hash };
    } else {
      console.log("transaction failed")
      return { error: "transaction failed" };
      //throw new Error("error 001")
    }
  } catch (error: any) {
    return { error: `buyNFT failed: ${error.message}` };
  }
}

type TypeMintNFT = {
  address: string
  price: string
  author: string
  path: string
}
export const mintNFT = async ({ address, price, author, path }: TypeMintNFT
) => {
  try {
    const hash = "abc123456789"
    return { hash };
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`mintNFT failed: ${error.message}`);
  }
}