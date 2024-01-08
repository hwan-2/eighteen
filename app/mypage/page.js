'use client'
import './mypage.css'
import { signOut, useSession } from 'next-auth/react'

export default async function Mypage(){

    return(
        <div className='mypage'>

            <div className='bookmark'>
                북마크
            </div>
            <button className='logout' onClick={()=>signOut({callbackUrl:'/'})}>
                로그아웃
            </button>
        </div>
        
    )
}