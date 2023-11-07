import { BoxT } from "@/lib/models/box.model"
import { NextResponse } from "next/server"

const DATA_SOURCE_URL = "http://localhost:8080"

export async function GET(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf('/') + 1)

  const res = await fetch(`${DATA_SOURCE_URL}/${id}`)

  const box: BoxT = await res.json()

  if (!box.id) return NextResponse.json({ "message": "Box not found" })

  return NextResponse.json(box)
}