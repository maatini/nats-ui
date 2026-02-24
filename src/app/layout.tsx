import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/components/providers/root-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NATS Nexus",
  description: "Professional NATS Management UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 antialiased`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
