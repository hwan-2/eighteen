import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"

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
                <Link href={"/"}>Home</Link>
                {/* 이후 로그인 판별 여부로 수정 */}
                {
                    session && session.user ? 
                    <Link href={"/mypage"}>MyPage</Link>     
                    : 
                    <Link href={"/login"}>Login</Link>
                }
            
            </div>
        </nav>
    )
}