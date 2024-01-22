import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"


export default async function Bookmark(){
    let session = await getServerSession(authOptions)
    if (session) {
        console.log(session.user._id)
    }
    else {
        console.log("로그인x")
    }

    const res = await fetch(`http://localhost:3000/api/get/${session.user._id}`)
    const data = await res.json()
    
    return(
        <></>
    )
}