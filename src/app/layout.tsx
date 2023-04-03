import "./globals.css";

export const metadata = {
  title: "Next.js + Web Components = ❤️",
  description: "A Next.js app with embeddable Web Components.",
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
