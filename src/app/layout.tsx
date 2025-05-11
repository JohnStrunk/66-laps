import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Noto_Color_Emoji } from "next/font/google";
import Script from "next/script";
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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string} />
      <body>
        <StrictMode>
          <Providers>
            {children}
          </Providers>
        </StrictMode>
        <Script id="clarity_analytics" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script>
      </body>
    </html>
  );
}
