//https://docs.uploadthing.com/nextjs/appdir
//Note: This is the ONLY FILE WHERE THE PATH MATTERS. You need to serve this API from /api/uploadthing as it is called via webhook to trigger onUploadComplete.

import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});