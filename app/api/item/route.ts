import { ItemT } from '@/types'
import { NextResponse } from 'next/server'
import item_data from '@/mockdata/item_data.json'

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/items"

const API_KEY: string = process.env.DATA_API_KEY as string

const delayFunc = (delay: number): Promise<boolean> => new Promise((resolve, reject) => setTimeout(() => {
  console.log("delay:", delay);
  resolve(true)
}, delay))

const mockResponse = () => {
  const itemOut = { "item_id": "161SxAvUwpMNVoCUUqbn8vGRQEnSGjN6Z6", "seller_id": "18xBe5NdALYzWoHN9QVWLjK8DUxzKQcc3r", "title": "felis ut", "img_url": "https://techcrunch.com/integer/", "fixed_price": 20, "min_price": 19, "bid_price": 43, "votes": 89, "status": "success" };
  //console.log(item_data[0])
  const myBlob = new Blob([JSON.stringify(itemOut, null, 2)], { type: 'application/json' });

  const myOptions = { "status": 200, "statusText": "SuperSmashingGreat!" };
  const res = new Response(myBlob, myOptions);
  return res;
}
//http://localhost:3000/api/item/
export const GET = async () => {
  //const res = await fetch(DATA_SOURCE_URL)
  //const items: ItemT[] = await res.json()
  let items: ItemT[];
  await delayFunc(1000)
  items = item_data;
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const { seller_id, title }: Partial<ItemT> = await request.json()
  console.log("🚀 POST ~ seller_id, title:", seller_id, title)

  if (!seller_id || !title) return NextResponse.json({ "message": "Missing required data" })

  await delayFunc(1000);
  const res = mockResponse()
  /*const res = await fetch(DATA_SOURCE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify({
      seller_id, title, status: false
    })
  })
*/
  const newTodo: ItemT = await res.json()

  return NextResponse.json(newTodo)
}

export async function PUT(request: Request) {
  const { seller_id, item_id, title, status }: ItemT = await request.json()
  console.log("🚀 PUT ~ seller_id, item_id, title, status:", seller_id, item_id, title, status)

  //|| typeof (status) !== 'boolean'
  if (!seller_id || !item_id || !title) return NextResponse.json({ "message": "Missing required data" })

  await delayFunc(1000);
  const res = mockResponse()
  /*const res = await fetch(`${DATA_SOURCE_URL}/${item_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify({
      seller_id, title, status
    })
  })*/

  const updatedTodo: ItemT = await res.json()

  return NextResponse.json(updatedTodo)
}

export async function DELETE(request: Request) {
  const { item_id }: Partial<ItemT> = await request.json()
  console.log("🚀 DELETE ~ item_id:", item_id)

  if (!item_id) return NextResponse.json({ "message": "ItemT item_id required" })

  await delayFunc(1000);
  const res = mockResponse()
  /*await fetch(`${DATA_SOURCE_URL}/${item_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    }
  })*/

  return NextResponse.json({ "message": `ItemT ${item_id} deleted` })
}