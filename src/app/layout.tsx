import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Noto_Color_Emoji } from "next/font/google";
import { StrictMode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "66 Laps",
  description: "Practice counting laps for swimming",
};

// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css
const atkinson_hyperlegible = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-atkinson-hyperlegible',
  preload: true,
});

const noto_color_emoji = Noto_Color_Emoji({
  weight: '400',
  subsets: ['emoji'],
  preload: true,
  display: 'swap',
  variable: '--font-noto-color-emoji',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${atkinson_hyperlegible.variable} ${noto_color_emoji.variable}`}
    >
      <body>
        <StrictMode>
          <Providers>
            {children}
          </Providers>
        </StrictMode>
      </body>
    </html>
  );
}
