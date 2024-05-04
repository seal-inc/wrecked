import { fetchMetadata } from "frames.js/next";

export async function generateMetadata({ params }) {
  const { id } = params;
  return {
    title: "Wrecked",
    other: await fetchMetadata(
      new URL(
        `/api/wrecked?id=${id}`,
        process.env.APP_URL ? `${process.env.APP_URL}` : `http://localhost:3000`
      )
    ),
  };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>This is the game baby!</div>
    </main>
  );
}
