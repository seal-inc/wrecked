"use client";

export default function Page() {
  const url =
    "https://warpcast.com/~/developers/frames?url=" +
    (process.env.APP_URL ? `${process.env.APP_URL}` : "http://localhost:3000") +
    "/mememania";

  console.log(url);
  return (
    <div className="w-[400px]">
      <a href={url} target="_blank">
        <button>Open mememania</button>
      </a>
    </div>
  );
}
