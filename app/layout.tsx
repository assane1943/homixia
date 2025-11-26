// app/layout.tsx
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Homixia — Conciergerie Premium",
  description: "Homixia — gestion premium de locations courte durée à Casablanca",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
