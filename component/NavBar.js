// "use client"
// import Link from "next/link";
// import { useSession} from 'next-auth/react'


// export default function NavBar() {
//     const { data: session } = useSession()


//     return (
//         <nav>
//             <div className={"navbar"}>
//                 <Link href={"/"}>Home</Link>
//                 {/* 이후 로그인 판별 여부로 수정 */}
//                 {
//                     !session && <Link href={"/login"}>Login</Link>
//                 }
//                 {
//                     session && <Link href={"/mypage"}>MyPage</Link>
//                 }
            
//             </div>
//         </nav>
//     )
// }