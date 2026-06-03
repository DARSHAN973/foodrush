import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
//Static metadata - default SEO title and description used when a page does not define its own metadata. 
export const metadata = {
  title: "Food Rush",
  description: "Food Delivery App Built With Next.js",
};
//Root layout - creates the whole document shell shared by the whole app.
//This is the only layout that should render <html> and <body>.
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
