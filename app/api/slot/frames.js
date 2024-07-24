import { createFrames } from "frames.js/next";
import { farcasterHubContext, neynarValidate } from "frames.js/middleware";

export const frames = createFrames({
  basePath: "/api/slot",
  middleware: [
    farcasterHubContext({
      hubHttpUrl: "https://hub-api.neynar.com",
      hubRequestOptions: {
        headers: {
          "x-api-key": "C32483E3-C3DF-44C6-BBA9-F39F537C23F2",
        },
      },
    }),
  ],
});
