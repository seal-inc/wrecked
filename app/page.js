export async function generateMetadata() {
  return {
    title: "Wrecked - Get Wrecked!",
    // provide a full URL to your /frames endpoint
  };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white justify-around p-24">
      <p className="text-[5rem] text-black">Get Wrecked!</p>
      <div
        className="z-10 max-w-5xl w-full h-[400px] justify-center lg:flex"
        style={{
          backgroundImage: `url(${process.env.APP_URL}/wrecked-2.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
    </main>
  );
}
