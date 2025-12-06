import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MockServiceProvider } from "@/components/mock-service-provider";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Hospital Management System | Landing",
  description:
    "Landing page for the Hospital Management System with secure login, registration, and online appointment booking.",
  openGraph: {
    title: "Hospital Management System",
    description:
      "Quy trinh dat lich kham, dang nhap va dang ky tai He thong Quan ly Benh vien.",
    url: "https://hms.example.com/",
    siteName: "Hospital Management System",
    images: [
      {
        url: "/images/hero-background.jpg",
        width: 1200,
        height: 630,
        alt: "Hospital Management System landing background",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital Management System",
    description:
      "Dat lich kham, dang nhap va dang ky nhanh trong he thong quan ly benh vien.",
    images: ["/images/hero-background.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans text-[16px] antialiased`}>
        <AuthProvider>
          <MockServiceProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
