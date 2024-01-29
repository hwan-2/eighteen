import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import User from '@/component/User';
import Image from 'next/image'
import logo from '../public/img/logo.png'
import DarkMode from "@/app/darkmode";

export default async function NavBar() {
    let session = await getServerSession(authOptions)
    if (session) {
        console.log(session)
    }
    else {
        console.log("로그인x")
    }

    return (
        <nav>
            <div className={"navbar"}>
                <a href={"/"} style={{ display: 'block', marginTop: '-10px' }}><Image src={logo} alt="Home"/></a>
                <div style={{ display: 'flex',  marginLeft: 'auto', gap: '10px', alignItems: 'center' }}>
                    <DarkMode></DarkMode>
                    {
                        session && session.user ?
                            <User/>
                            // SignOut이 서버에서 사용 불가능하므로 클라이언트 컴포넌트 따로 만듦
                            :
                            <Link href={"/login"}>Login</Link>
                    }
                </div>
            </div>
        </nav>
    )
}