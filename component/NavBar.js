import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import { signOut } from "next-auth/react";


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
                <Link href={"/"}>Home</Link>
                {/* 이후 로그인 판별 여부로 수정 */}
                {
                    session && session.user ? 
                    <div className="dropDown">
                        <ul className="dropDownList">
                            <li>
                                <Link href={"/mypage"}>Mypage</Link>
                            </li>
                            <li>
                                <Link href={"/"}>Logout</Link>
                            </li>
                        </ul>
                        
                    </div>
  
                    : 
                    <Link href={"/login"}>Login</Link>
                    
                    
                }
            </div>
        </nav>
    )
}