import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css';


export const metadata: Metadata = {
  title: 'Wowratings',
  description: 'Simple stupid app',
  icons:"/WoW_icon.png"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className=" w-screen h-screen items-center flex justify-center overflow-x-hidden">{children}</body>
    </html>
  )
}
