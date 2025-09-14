import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Landing page for the web application",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}