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
// Static metadata — default SEO title and description for the app.
// Individual pages can override this with their own metadata when needed.
export const metadata = {
  title: {
    default: "FoodRush - Super Fast Food Delivery",
    template: "%s | FoodRush",
  },
  description:
    "Order food online from your favorite local restaurants with super-fast delivery on FoodRush.",
};

// Root layout — creates the document shell shared by the whole app.
// Only the root layout should render <html> and <body>.
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
