'use client';

import { Inter } from "next/font/google";
import "@/styles/style.scss";

import Cookies from 'js-cookie'; 
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'; 

import Login from '@/app/login/page';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const router = useRouter();

  return (
    <html lang="en">
      <head>
        <title>My Finances</title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
  
}
