import { ItemT } from "@/types"
import { NextResponse } from "next/server"

const DATA_SOURCE_URL = "http://localhost:8080"

export async function GET(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf('/') + 1)

  const res = await fetch(`${DATA_SOURCE_URL}/${id}`)

  const item: ItemT = await res.json()

  if (!item.item_id) return NextResponse.json({ "message": "Todo not found" })

  return NextResponse.json(item)
}