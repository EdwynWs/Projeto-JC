import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: "JCortiça Painéis Elétricos",
    description: "Sistema de gerenciamento de manuais e projetos elétricos",
};

export default function RootLayout({ children }) {

  return (

    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >

      <head>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/startbootstrap-sb-admin-2@4.1.4/css/sb-admin-2.min.css"
        />

      </head>

      <body id="page-top">

        <Toaster position="top-right" />

        {children}

      </body>

    </html>
  );
}