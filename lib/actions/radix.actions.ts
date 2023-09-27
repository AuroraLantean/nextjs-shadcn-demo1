"use server";
import { revalidatePath } from "next/cache";

type TypeBuyNFT = {
  nftId: string
  address: string
  amount: string
}
export const buyNFT = async ({ nftId, address, amount }: TypeBuyNFT) => {
  try {
    setTimeout(() => {
      console.log("radix.actions: buyNFT")
    }, 3000);
    //throw new Error("error 001")

    const hash = "abc123456789"
    return { hash };
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