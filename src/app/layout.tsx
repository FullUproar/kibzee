import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Kibzee - Discover Local Arts & Culture",
  description: "Find concerts, theater, gallery openings, and more in Michiana. Curated by locals who love the arts.",
  keywords: "events, concerts, theater, art, culture, South Bend, Mishawaka, Michiana",
  authors: [{ name: "Kibzee" }],
  openGraph: {
    title: "Kibzee - Discover Local Arts & Culture",
    description: "Find concerts, theater, gallery openings, and more in Michiana.",
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
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
