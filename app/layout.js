import { Inter } from "next/font/google";
import { getAuthSession } from "@/lib/session";
import Providers from "@/components/Providers";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata = {
  title: "Employee Management System",
  description: "Secure admin dashboard for employee records",
};

export default async function RootLayout({ children }) {
  const session = await getAuthSession();

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
