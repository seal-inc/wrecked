import { fetchMetadata } from "frames.js/next";

export async function generateMetadata({ params }) {
  try {
    return {
      title: "Slot",
      other: await fetchMetadata(
        new URL(
          `/api/slot`,
          process.env.APP_URL
            ? `${process.env.APP_URL}`
            : "http://localhost:3000"
        )
      ),
    };
  } catch (error) {
    return {
      title: "Slot",
    };
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>This is the game baby!</div>
    </main>
  );
}
