import './mypage.css'
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"

export default async function Mypage(){
    let session = await getServerSession(authOptions)
    if (session) {
        console.log(session.user._id)
    }
    else {
        console.log("로그인x")
    }

    const res = await fetch(`http://localhost:3000/api/get/${session.user._id}`)
    const data = await res.json()

    const a = JSON.stringify(data, null, 2);

    return(
        <div className='mypage'>
            {a}
            {/* <button className='logout' onClick={()=>signOut({callbackUrl:'/'})}>
                로그아웃
            </button> */}
        </div>
        
    )
}

