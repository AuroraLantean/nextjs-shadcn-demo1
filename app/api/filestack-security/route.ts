import * as filestack from 'filestack-js';

export async function POST(req: Request) {
  //check if the use is logged in

  const body = await req.json();
  console.log("body:", body);

  //Generate your JSON policy here: https://dev.filestack.com/apps/YOUR_API_KEY/security/
  const policy = {
    call: ["pick", "read", "convert"],
    maxSize: 2048000,
    expiry: 1714406400,//to limit the view until this date
  }//https://www.filestack.com/docs/security/policies/

  const filestackApiKey = process.env.FILESTACK_APP_SECRET;
  if (!filestackApiKey) {
    return Response.json({
      data: { policy: null, signature: null },
    });
  }
  let security = filestack.getSecurity(policy, filestackApiKey)

  return Response.json({
    data: security
  });
}