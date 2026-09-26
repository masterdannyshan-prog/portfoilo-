import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [{ path: "../../public/fonts/InterVariable.woff2", weight: "100 900", style: "normal" }],
});

const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Darshan | UI/UX Designer",
  description: "Darshan is a UI/UX designer who turns ideas into working digital products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Browser extensions may add attributes to body before hydration. */}
      <body suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
