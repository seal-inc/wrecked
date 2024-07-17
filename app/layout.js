import "./globals.css";
import { pixeled } from "./styles/fonts";

export const metadata = {
  title: "Meme Mania",
  description: "The fastest way to the moon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={pixeled.className}>{children}</body>
    </html>
  );
}
