import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LGS Pusula Demo",
  manifest: "/manifest.webmanifest",
  appleWebApp: {capable:true,title:"LGS Pusula",statusBarStyle:"default"},
  description: "Dört kurmaca öğrenciyle çalışma takibini öğretmen ve öğrenci olarak deneyin.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/app-icon.png",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
