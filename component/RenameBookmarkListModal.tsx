"use client"

import { useState, useEffect } from 'react'

interface RenameListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess : () => void;
  listItem : {listId : string, listName : string, listIndex: number}
}

export default function RenameBookmarkListModal({isOpen, onClose, onSuccess, listItem} : RenameListModalProps) {
    const [input, setInput] = useState<string>("")

    const handleChange = (value : string) => {
        setInput(value)
        console.log(input)
    }
    const handleKeyDown = (e : any) => {
        if (e.key === "Enter") {
            renameList()
        }
    }

    useEffect(() => {
        if (listItem) {
            setInput(listItem.listName);
        }
    }, [listItem]);

    const renameList = async () => {
        const res = await fetch('api/bookmark/renameBookmark',
        {
            method: 'PUT',
            body : JSON.stringify({
                listId : listItem.listId,
                newListName : input,
            })
        })

        const result = await res.json()

        if (!res.ok) {
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
                zIndex: 15,
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
                    그룹명 변경 "{listItem.listName}"

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
                            <button onClick = {renameList}>
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