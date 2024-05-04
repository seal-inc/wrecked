import Image from "next/image";

import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
  return {
    title: "Wrecked",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL(
        "/",
        process.env.APP_URL ? `${process.env.APP_URL}` : "http://localhost:3000"
      )
    ),
  };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        Get Wrecked!
      </div>
    </main>
  );
}
