export async function POST(req: Request) {
  const body = await req.json();
  console.log("body:", body);
  //verify the incoming request is from Filestack
  //save body.text.url to db
  return new Response("ok")
}