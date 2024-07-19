"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import Image from "next/image";

export default function Page() {
  const url =
    "https://warpcast.com/~/developers/frames?url=" +
    (process.env.APP_URL ? `${process.env.APP_URL}` : "http://localhost:3000") +
    "/mememania";

  return (
    <div
      className="flex flex-col w-full h-full min-h-screen items-center justify-center space-y-2"
      style={{
        backgroundImage: `url(${
          process.env.APP_URL || "http://localhost:3000"
        }/artifacts/assets/bg.png)`,
        backgroundSize: "cover",
        backgroundBlendMode: "lighten",
      }}
    >
      <div className="flex flex-col items-end w-full px-36">
        <a
          href="https://seal-2.gitbook.io/meme-mania/"
          target="_blank"
          className="px-8 py-4 bg-sky-200 shadow border-2 border-black justify-center items-center gap-2"
        >
          <button>DOCS</button>
        </a>
      </div>
      <div
      // className="h-[600px]"
      // style={{
      //   clipPath: "inset(25% 0% 25% 0%)",
      // }}
      >
        <Player
          src="/artifacts/assets/animation.json"
          loop
          autoplay
          className="h-[500px]"
          style={{
            clipPath: "inset(20% 0% 20% 0%)",
          }}
        />
      </div>

      <div className="flex flex-col space-y-8 items-center">
        <div className="text-3xl font-bold text-[#161718] text-center leading-normal">
          {" "}
          THE FASTEST WAY TO THE MOON
        </div>
        <a
          href={url}
          target="_blank"
          className="px-8 py-4 bg-sky-200 shadow border-2 border-black justify-center items-center gap-2"
        >
          <button>OPEN FRAME</button>
        </a>
      </div>
    </div>
  );
}
