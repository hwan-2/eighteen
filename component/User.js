"use client"

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function User(){

    const [open, setOpen] = useState(false)

    return (
        <div>
            <div>
                <button onClick={() => setOpen((prev) => !prev)}>
                    프로필
                </button>
            </div>
            {
                open && (
                    <div className="dropDown">
                        <ul className="dropDownList">
                            <li>
                                <Link href={"/mypage"}>Mypage</Link>
                            </li>
                            <li>
                                <button className='logout' onClick={()=>signOut({callbackUrl:'/'})}>
                                    로그아웃
                                </button>
                            </li>
                        </ul>   
                    </div>
                )
            }
            
        </div>
        
    )
}