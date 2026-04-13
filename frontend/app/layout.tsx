import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "EduVaultX - Blockchain-Secured Exam Management",
  description: "Tamper-proof exam paper management powered by blockchain technology — EduVaultX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppShell>
          {children}
        </AppShell>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              borderRadius: '0px',
              fontSize: '12px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            },
          }}
        />
      </body>
    </html>
  );
}
