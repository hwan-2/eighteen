"use client"

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function User(){

    const [open, setOpen] = useState(false)

    return (
        <div>
            <div>
                <FaUserCircle size="30" color="white" onClick={() => setOpen((prev) => !prev)} />
                {/* 프로필 버튼 */}
            </div>
            {
                open && (
                    <div className="dropDown">
                        <ul className="dropDownList">
                            <li onClick={() => setOpen((prev) => !prev)}> 
                            {/* 클릭 시 닫히게 */}
                                <Link href={"/mypage"}>Mypage</Link>
                            </li>
                            <li onClick={() => setOpen((prev) => !prev)}>
                                <Link href={"/"} onClick={()=> signOut({callbackUrl:'/'}) }>
                                    Logout
                                </Link>
                                {/* Link에서 바꿀예정 */}
                            </li>
                        </ul>   
                    </div>
                )
            }
        </div>
    )
}