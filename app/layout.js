import { StoreProvider } from '../store/provider';
import '../styles/globals.scss';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from './Providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AndroBay',
  description: 'AndroBay- One-stop shop for various IUI Kits',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
        <StoreProvider>
        {children}
        </StoreProvider>
        </NextAuthProvider>
        </body>
    </html>
  )
}
