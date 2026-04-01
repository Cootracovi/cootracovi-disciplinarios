import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COOTRACOVI - Sistema de Procesos Disciplinarios",
  description: "Sistema de gestión de procesos disciplinarios para COOTRACOVI - Cooperativa de Transporte de Pasajeros Urbano",
  keywords: ["COOTRACOVI", "Procesos Disciplinarios", "Cooperativa", "Transporte"],
  authors: [{ name: "COOTRACOVI" }],
  icons: {
    icon: "https://i.ibb.co/F4313WXS/LOGO-COOTRACOVI-ODS.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
