import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import User from '@/component/User';
import Image from 'next/image'
import logo from '../public/img/logo.png'

export default async function NavBar() {
    let session = await getServerSession(authOptions)
    if (session) {
        console.log(session)
    }
    else {
        console.log("로그인x")
    }

    // const [open, setOpen] = useState(false)
    return (
        <nav>
            <div className={"navbar"}>
                {/*<Link href={"/"}>Home</Link>*/}
                <Link href={"/"} style={{ display: 'block', marginTop: '-10px' }}><Image src={logo} alt="Home"/></Link>
                {/* 이후 로그인 판별 여부로 수정 */}
                {
                    session && session.user ? 
                    <User/> 
                    // SignOut이 서버에서 사용 불가능하므로 클라이언트 컴포넌트 따로 만듦
                    : 
                    <Link href={"/login"}>Login</Link>
                }
            </div>
        </nav>
    )
}