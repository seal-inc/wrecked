"use client";

import Image from "next/image";

export default function Page() {
  const url =
    "https://warpcast.com/~/developers/frames?url=" +
    (process.env.APP_URL ? `${process.env.APP_URL}` : "http://localhost:3000") +
    "/mememania";

  return (
    <div
      className="flex flex-col w-full h-screen items-center justify-center space-y-36"
      style={{
        backgroundImage: `url(${
          process.env.APP_URL || "http://localhost:3000"
        }/artifacts/assets/bg.png)`,
        backgroundSize: "cover",
        backgroundBlendMode: "lighten",
      }}
    >
      <div className="m-2">
        <Image
          src={
            process.env.APP_URL ||
            "http://localhost:3000" + "/artifacts/assets/log.png"
          }
          width={700}
          height={700}
          className="object-scale-down"
        ></Image>
      </div>

      <div className="flex flex-col space-y-8 items-center">
        <div className="text-3xl font-bold text-[#161718]">
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
