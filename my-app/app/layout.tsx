import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// app/layout.tsx or pages/_app.tsx
// to fonts load them once for all SurveyJS components
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Orion App",
  description: "Orion - University of Winnipeg Ethics Review Dashboard",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
          {children}
      </body>
    </html>
  );
}
