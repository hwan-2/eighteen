'use client'

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation"
import { MdDarkMode } from "react-icons/md";
import { FaSun } from "react-icons/fa6";

type ThemeMode = 'light' | 'dark' | '';

export default function DarkMode(){
    const router = useRouter()
    const [mode, setMode] = useState<ThemeMode>('')

    const getModeCookie = (): ThemeMode => {
        if (typeof document === 'undefined') return ''
        const match = document.cookie.match(/(^| )mode=([^;]+)/)
        return (match ? match[2] : '') as ThemeMode
    };

    useEffect(() => {
        const currentCookie = getModeCookie()
        if (!currentCookie) {
            document.cookie = `mode=light; max-age=${3600 * 24 * 5}; path=/`
            setMode('light')
        } else {
            setMode(currentCookie)
        }
    }, []);

    const toggleMode = () => {
        const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light'

        document.cookie = `mode=${newMode}; max-age=${3600 * 24 * 5}; path=/`
        setMode(newMode)
        router.refresh()
    };

    return(
        <span onClick={toggleMode}>
            {mode === 'dark' ? (
                <MdDarkMode style={{ cursor: 'pointer', color: 'white' }} />
            ) : (
                <FaSun style={{ cursor: 'pointer', color: 'white' }} />
            )}
        </span>
    )
}
