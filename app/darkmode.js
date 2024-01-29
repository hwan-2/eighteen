'use client'

import {useEffect} from "react";
import { useRouter } from "next/navigation"
import { MdDarkMode } from "react-icons/md";
import { FaSun } from "react-icons/fa6";

export default function DarkMode(){
    let router = useRouter()

    useEffect(() => {
        let cookie = ('; '+document.cookie).split(`; mode=`).pop().split(';')[0]
        if (cookie == ''){
            document.cookie = 'mode= light; max-age' + (3600 * 24 * 5)
        }
    }, []);

    const isDarkMode = () => {
        let cookie = ("; " + document.cookie)
            .split(`; mode=`)
            .pop()
            .split(";")[0];
        return cookie === "dark";
    };

    return(
        <span onClick={()=>{

            let cookie = ('; '+document.cookie).split(`; mode=`).pop().split(';')[0]
            if (cookie == 'light') {
                document.cookie = 'mode=dark; max-age=' + (3600 * 24 * 5)
                router.refresh()
            } else {
                document.cookie = 'mode=light; max-age=' + (3600 * 24 * 5)
                router.refresh()
            }
        }}>{isDarkMode() ? <MdDarkMode style={{ cursor: 'pointer' }}/> : <FaSun style={{ cursor: 'pointer', color: 'white' }}/>}
        </span>
    )
}