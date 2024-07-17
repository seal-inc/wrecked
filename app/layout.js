import "./globals.css";
import { Audiowide } from "next/font/google";

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Mememania",
  description: "The fastest way to the moon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={audiowide.className}>{children}</body>
    </html>
  );
}
