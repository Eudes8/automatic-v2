import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { I18nProvider } from "@/lib/i18n";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AUTOMATIC - Développement Logiciel sur-Mesure",
  description: "AUTOMATIC est la référence incontournable du développement logiciel sur-mesure, offrant une expérience client entièrement intégrée, transparente et d'une efficacité inégalée.",
  keywords: ["AUTOMATIC", "développement logiciel", "sur-mesure", "applications web", "mobile", "SaaS", "IA", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Équipe AUTOMATIC" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AUTOMATIC - Développement Logiciel sur-Mesure",
    description: "La plateforme intégrée de services de développement logiciel. Configurer, estimer et lancer votre projet de manière autonome.",
    url: "https://automatic.dev",
    siteName: "AUTOMATIC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AUTOMATIC - Développement Logiciel sur-Mesure",
    description: "La plateforme intégrée de services de développement logiciel. Configurer, estimer et lancer votre projet de manière autonome.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 mt-20">{children}</main>
              <Footer />
            </div>
          </I18nProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
