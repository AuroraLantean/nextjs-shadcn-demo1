import { NextResponse } from 'next/server'
import box_data from '@/mockdata/box_data.json'
import { BoxT } from '@/lib/models/box.model';

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
export async function GET() {
  /*Frontend code:
  const res = await fetch(DATA_SOURCE_URL)
    if (!res.ok) {
      throw new Error(`error status: ${res.status}`);
    }
  const boxes: BoxT[] = await res.json()
  */
  await delayFunc(1000);
  const boxes: BoxT[] = box_data;
  return NextResponse.json(boxes)
}

export async function POST(request: Request) {
  const { seller_id, title }: Partial<BoxT> = await request.json()
  console.log("🚀 POST ~ seller_id, title:", seller_id, title)

  if (!seller_id || !title) return NextResponse.json({ "message": "Missing required data" })

  await delayFunc(1000);
  const res = mockResponse()
  /*Frontend code:
  const res = await fetch(DATA_SOURCE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify({
      seller_id, title, status: false
    })
  })
    if (!res.ok) {
      throw new Error(`error status: ${res.status}`);
    }
  */
  const newTodo: BoxT = await res.json()

  return NextResponse.json(newTodo)
}

export async function PUT(request: Request) {
  const { seller_id, id, title, status }: BoxT = await request.json()
  console.log("🚀 PUT ~ seller_id, id, title, status:", seller_id, id, title, status)

  //|| typeof (status) !== 'boolean'
  if (!seller_id || !id || !title) return NextResponse.json({ "message": "Missing required data" })

  await delayFunc(1000);
  const res = mockResponse()
  /*Frontend code:
  const { id, ...rest } = updatedBox;
  const res = await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify(rest)
  })
    if (!res.ok) {
      throw new Error(`error status: ${res.status}`);
    }
  */
  const updatedBox: BoxT = await res.json()
  return NextResponse.json(updatedBox)
}

export async function DELETE(request: Request) {
  const { id }: Partial<BoxT> = await request.json()
  console.log("🚀 DELETE ~ id:", id)

  if (!id) return NextResponse.json({ "message": "BoxT id required" })

  await delayFunc(1000);
  const res = mockResponse()
  /*Frontend code:
  await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    }
  })
    if (!res.ok) {
      throw new Error(`error status: ${res.status}`);
    }
  */
  return NextResponse.json({ "message": `BoxT ${id} deleted` })
}