import { NextResponse } from 'next/server'
import box_data from '@/mockdata/box_data.json'
import { BoxT } from '@/lib/models/box.model';
import z from 'zod';
import { addOrUpdateOne, deleteOne, findAll } from '@/lib/actions/box.actions';
import { Split } from 'lucide-react';

const delayFunc = (delay: number): Promise<boolean> => new Promise((resolve, reject) => setTimeout(() => {
  console.log("delay:", delay);
  resolve(true)
}, delay))

const mockResponse = () => {
  const box = { "id": "7", "title": "integer", "seller_id": "9nXgU0GWjowSDQfR", "available": 74, "total": 292, "status": "open", "detail_link": "http://angelfire.com/tristique/tortor.js", "img_link": "http://dummyimage.com/209x119.png/5fa2dd/ffffff", "compo_addr": "1MMjjVKgYv5FovSXGz1VMkmnyM4QsHvzKs", "interest": 13.94, "fixed_price": 428.14, "min_price": 382.18, "bid_price": 179.7, "votes": 47 };
  //console.log(box_data[0])
  const myBlob = new Blob([JSON.stringify(box, null, 2)], { type: 'application/json' });

  const myOptions = { "status": 200, "statusText": "SuperSmashingGreat!" };
  const res = new Response(myBlob, myOptions);
  return res;
}
//http://localhost:3000/api/item/
export async function GET(req: Request) {
  console.log("🚀 GET")
  const id = req.url.split('=')[1];
  console.log("🚀 GET ~ id:", id);
  try {
    const boxes = await findAll();
    //await delayFunc(1000);
    //const boxes: BoxT[] = box_data;
    return NextResponse.json({ boxes });// output will be data.boxes
  } catch (err: any) {
    if (err instanceof z.ZodError) return new Response(err.issues[0].message, { status: 422 });
    return new Response(err.message, { status: 500 });
  }
}

export async function POST(req: Request) {
  console.log("🚀 POST");
  const body = await req.json();
  console.log("🚀 POST ~ body:", body);
  const box: Partial<BoxT> = body.box;
  const { id, title, total } = box;
  if (!id || !title || !total) return new Response("Missing required data", { status: 404 });

  try {
    const newBox = await addOrUpdateOne(box);
    return new Response("OK", { status: 200 })
    //return NextResponse.json(newBox)
    //await delayFunc(1000);
    //const res = mockResponse()
    //const newTodo: BoxT = await res.json()
  } catch (err: any) {
    if (err instanceof z.ZodError) return new Response(err.issues[0].message, { status: 422 });
    return new Response(err.message, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  console.log("PATCH");
  //console.log("PATCH", req, req.url);
  const body = await req.json();
  console.log("body:", body)
}
export async function PUT(req: Request) {
  console.log("PUT");
  //console.log("PUT", req, req.url);
  const body = await req.json();
  console.log("🚀 POST ~ body:", body);
  const box: Partial<BoxT> = body.box;
  const { id, title, total } = box;

  //const { seller_id, id, title, status }: BoxT = await req.json()
  console.log("🚀 PUT ~ seller_id, id, title, status:", id, title, total)

  //|| typeof (status) !== 'boolean'
  if (!total || !id || !title) return NextResponse.json({ message: "Missing required data" })

  try {
    const newBox = await addOrUpdateOne(box);
    return new Response("OK", { status: 200 })
    //await delayFunc(1000);
    //const res = mockResponse()
    //return NextResponse.json(updatedBox)
  } catch (err: any) {
    if (err instanceof z.ZodError) return new Response(err.issues[0].message, { status: 422 });
    return new Response(err.message, { status: 500 });
  }
}
//DELETE cannot get req body!
export async function DELETE(req: Request) {
  console.log("DELETE");
  //console.log("DELETE", req, req.url);
  const id = req.url.split('=')[1];
  console.log("🚀 DELETE ~ id:", id);

  if (!id) return NextResponse.json({ message: "box id required", status: 400 });

  try {
    await deleteOne(id)
    return new Response("OK", { status: 200 })
    //return NextResponse.json({ "message": `BoxT ${id} deleted` })
  } catch (err: any) {
    if (err instanceof z.ZodError) return new Response(err.issues[0].message, { status: 422 });
    return new Response(err.message, { status: 500 });
  }
}