import { signIn } from 'next-auth/react';
import './globals.css'
import Link from "next/link";

export const metadata = {
  title: 'Eighteen',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>
        <div className={"navbar"}>
          <Link href={"/"}>Home</Link>
          {/* 이후 로그인 판별 여부로 수정 */}
          <Link href={"/login"}>Login</Link>
        </div>
        <div className={"wrap"}>
          {children}
        </div>
        <div className={"footer"}>
          <Link href={"/"}>안녕</Link>
        </div>
      </body>
      </html>
  )
}
