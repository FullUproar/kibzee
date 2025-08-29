import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import LaunchBanner from "@/components/ui/launch-banner";

export const metadata: Metadata = {
  title: "Kibzee - Where Music Lives",
  description: "Connect with passionate music instructors in your neighborhood. Learn guitar, piano, and more with trusted local teachers.",
  keywords: "music lessons, music teachers, learn music, guitar lessons, piano lessons, local instructors",
  authors: [{ name: "Kibzee" }],
  openGraph: {
    title: "Kibzee - Where Music Lives",
    description: "Connect with passionate music instructors in your neighborhood.",
    url: "https://kibzee.com",
    siteName: "Kibzee",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthSessionProvider>
          <LaunchBanner />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
