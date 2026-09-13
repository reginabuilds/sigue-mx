import type { Metadata } from "next";
import { Fraunces, Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIGUE MX — Del resultado al siguiente paso",
  description:
    "Demo académica: ayuda a interpretar un resultado de screening y preparar un siguiente paso realista. No diagnostica ni prescribe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${lexend.variable} ${fraunces.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
