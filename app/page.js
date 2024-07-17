"use client";

import Image from "next/image";

export default function Page() {
  const url =
    "https://warpcast.com/~/developers/frames?url=" +
    (process.env.APP_URL ? `${process.env.APP_URL}` : "http://localhost:3000") +
    "/mememania";

  console.log(url);
  return (
    <div
      className="flex flex-col w-full h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${
          process.env.APP_URL || "http://localhost:3000"
        }/artifacts/assets/bg.png)`,
        backgroundSize: "cover",
        backgroundBlendMode: "lighten",
      }}
    >
      <div className="overflow-hidden h-[650px] object-cover">
        <Image
          src={
            process.env.APP_URL ||
            "http://localhost:3000" + "/artifacts/assets/animation.gif"
          }
          width={800}
          height={800}
          className="object-scale-down"
        ></Image>
      </div>
      <a href={url} target="_blank">
        <button>Open mememania</button>
      </a>
    </div>
  );
}
