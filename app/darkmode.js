'use client'

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation"
import { MdDarkMode } from "react-icons/md";
import { FaSun } from "react-icons/fa6";

export default function DarkMode(){
    let router = useRouter()
    const [isDarkMode, setDarkMode] = useState(false);

    useEffect(() => {
        let cookie = ('; '+document.cookie).split(`; mode=`).pop().split(';')[0]
        if (cookie == ''){
            document.cookie = 'mode= light; max-age' + (3600 * 24 * 5)
        }
    }, []);

    return(
        <span onClick={()=>{

            let cookie = ('; '+document.cookie).split(`; mode=`).pop().split(';')[0]
            if (cookie == 'light') {
                setDarkMode(true)
                document.cookie = 'mode=dark; max-age=' + (3600 * 24 * 5)
                router.refresh()
            } else {
                setDarkMode(false)
                document.cookie = 'mode=light; max-age=' + (3600 * 24 * 5)
                router.refresh()
            }
        }}>{isDarkMode ? <MdDarkMode style={{ cursor: 'pointer', color: 'white' }}/> : <FaSun style={{ cursor: 'pointer', color: 'white' }}/>}
        </span>
    )
}