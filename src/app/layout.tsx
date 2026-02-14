import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroDream — Dream Wellness Journal",
  description:
    "Integrate your dreams with neuroscience insights and life enhancement journaling. A context-aware dream interpretation and wellness tool.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="starfield" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
