import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LoadingProvider } from "@/components/contexts/LoadingContext";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "American-Airway",
  description:
    "Book and manage your flights easily with American-Airway.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="tawk-script" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/63ad9831c2f1ac1e202ab7c9/1glf1l1c3';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();

            Tawk_API.onLoad = function(){
                Tawk_API.setAttributes({
                    'widget-height': '300px',
                    'widget-width': '280px',
                    'widget-position': 'bottom-right',
                    'widget-offset': '20px, 20px'
                }, function(error){});
            };
          `}
        </Script>
      </head>
      <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <SessionProvider session={session}>
              <LoadingProvider>
                <div className="flex flex-col min-h-screen bg-background text-foreground">
                  <main className="flex-grow">
                    {children}
                    <Toaster />
                  </main>
                  <Analytics />
                  <SpeedInsights />
                </div>
              </LoadingProvider>
            </SessionProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
