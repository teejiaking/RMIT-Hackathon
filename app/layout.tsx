import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "TrustVault · Your information. Your decision.",
  description:
    "A private student document vault with selective consent. Synthetic hackathon demonstration.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
