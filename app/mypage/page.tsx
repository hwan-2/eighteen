import './mypage.css'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import Rtpage from "./rtpage"
import Localpage from './localpage'
import Delete from "./delete"

interface SessionTest {
    user : {
        name?: string
        email? : string
        _id : string
    }
}

export default async function Mypage(){
    let session : SessionTest | null = await getServerSession(authOptions)
    let data = null

    const fetchBookmark = async () => {
        const res = await fetch(`https://eighteen-three.vercel.app/api/get/${session?.user._id}`)
        return await res.json()
    }

    if (session) {
        // const res = await fetch(`https://eighteen-three.vercel.app/api/get/${session?.user._id}`)
        // data = await res.json()
        data = await fetchBookmark()
    }

    
    // const res = await fetch(`https://eighteen-three.vercel.app/api/get/${session?.user._id}`)
    // const data = await res.json()

    return(
        <div className='mypage'>
            {session?
            <h1>안녕하세요 {session?.user.name}님!</h1>
                : <h1>로그인하면 더 좋아요</h1>}
            {session? 
                <Rtpage tableData = {data}/>
                : <Localpage/>
            }
            
            {/* <table className='table'>
                <thead>
                    <tr>
                        <th>제공</th>
                        <th>번호</th>
                        <th>제목</th>
                        <th>가수</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                    return <tr className="tr" key={index}>
                      <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>
                      <td>{item.no}</td>
                      <td>{item.title}</td>
                      <td>{item.singer}</td>
                      <td><Delete item={item}/></td>
                    </tr>
                    })
                  } 
                </tbody>
            </table> */}
        </div>
        
    )
}

