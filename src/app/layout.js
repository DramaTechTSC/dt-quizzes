import { Lato, Playfair_Display, Playfair_Display_SC } from "next/font/google";
import App from './App';
import "./globals.css";
import { Link } from "@heroui/link";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const pd = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400"]
});

const pdSC = Playfair_Display_SC({
  variable: "--font-playfair-display-sc",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata = {
  title: "DT Quiz",
  description: "DT Quizzes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${pd.variable} ${pdSC.variable} antialiased min-h-screen bg-background
      text-foreground font-body flex flex-col justify-stretch pb-16 md:pb-20`}>
        <header className="w-full text-center p-4"><h1>DT Quizzes!</h1></header>
        <App>{children}</App>
      </body>
    </html>
  );
}
