import './mypage.css'
import { authOptions } from "@/pages/api/auth/[...nextauth].js"
import { getServerSession } from "next-auth"
import Delete from "./delete"

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
            <h1>안녕하세요 {session.user.name}님!</h1>
            <table className='table'>
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
            </table>
            {/* <button className='logout' onClick={()=>signOut({callbackUrl:'/'})}>
                로그아웃
            </button> */}
        </div>
        
    )
}

