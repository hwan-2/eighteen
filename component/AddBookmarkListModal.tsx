"use client"

import { useState } from 'react'

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess : () => void;
}

export default function AddBookmarkListModal({isOpen, onClose, onSuccess} : AddListModalProps) {
    const [input, setInput] = useState<string>("")

    const handleChange = (value : string) => {
        setInput(value)
        console.log(input)
    }
    const handleKeyDown = (e : any) => {
        if (e.key === "Enter") {
            addList()
        }
    }

    const addList = async () => {
        const res = await fetch('api/bookmark/createList',
        {
            method: 'POST',
            body : JSON.stringify({
                newListName : input,
            })
        })

        const result = await res.json()

        if (!res.ok) {
            // if (res.status === 400) {
            //     alert("이미 존재하는 보관함 이름입니다.")
            // }
            alert(result)
        }
        else {
            onSuccess()
            setInput("")
            onClose()
        }
        
    }

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    minWidth: "200px",
            }}>
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    새 그룹 추가

                    <input
                        type="text"
                        placeholder="..."
                        className=""
                        value = {input}
                        onChange={(e)=>handleChange(e.target.value)}
                        onKeyDown = {handleKeyDown}
                        style={{
                            margin: "10px",
                        }}
                    />
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "right"
                        }}>
                            <button onClick = {addList}>
                                저장
                            </button>
                            <button onClick={onClose}>
                                닫기
                            </button>
                    </div>
                </div>
            </div>
        </div>

    )
}