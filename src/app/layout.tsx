import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css';
import CharacterList from './_components/characters/CharacterList';
import { readFromFile } from './_lib/utils/serverFunctions';


export const metadata: Metadata = {
  title: 'Wowratings',
  description: 'Simple stupid app',
  icons: "/WoW_icon.png"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const characterData = readFromFile()
  
  return (
    <html lang="en">
      <body className=" w-screen h-screen items-center flex justify-center overflow-x-hidden">
       
          {children}
         
      </body>
    </html>
  )
}
