'use client'
import './mypage.css'
import { signOut } from 'next-auth/react'

export default function Mypage(){

    return(
        <div className='mypage'>
            <>마이페이지</>
            <button className='logout' onClick={()=>signOut({callbackUrl:'/'})}>
                로그아웃
            </button>
        </div>
        
    )
}