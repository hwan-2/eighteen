"use client"

import { Checkbox } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'


interface SearchData {
  brand: string;
  no: string;
  title: string;
  singer: string;
}


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkGroupList : string[];
  tmpTitle : SearchData;
  onSuccess : () => void;
}


export default function BookmarkModal({isOpen, onClose, bookmarkGroupList, tmpTitle, onSuccess} : ModalProps) {

    const [input, setInput] = useState<string>("")
    const [saveOpen, setSaveOpen] = useState(false);
    const [checkedLists, setCheckedLists] = useState<string[]>([]);

    const handleCheckboxChange = (item: string) => {
        setCheckedLists((prev) =>
            prev.includes(item)
            ? prev.filter((value) => value !== item)
            : [...prev, item]
        );
        console.log(checkedLists)
    }

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
            setSaveOpen(false)
        }
        
    }

    const deleteList = async (item) => {
        const res = await fetch(`api/bookmark/deleteLists?listName=${encodeURIComponent(item)}`,
        {
            method: 'DELETE',
        })

        const result = await res.json()
        if (!res.ok) {
            console.log(result)
            console.log(item)
        }
        onSuccess()
    }

    const fetchBookmark = async () => {
        // const res = await fetch('api/post/newSave',
        // {
        //     method: 'POST',
        //     body : JSON.stringify({
        //     listName : "오타쿠",
        //     brand : tmpTitle.brand,
        //     no: tmpTitle.no,
        //     title: tmpTitle.title,
        //     singer: tmpTitle.singer })
        // })
        // const result = await res.json()

        try {
            await Promise.all(
            checkedLists.map(async (item) => {
                const res = await fetch('api/post/newSave',
                    {
                        method: 'POST',
                        body : JSON.stringify({
                        listName : item,
                        brand : tmpTitle.brand,
                        no: tmpTitle.no,
                        title: tmpTitle.title,
                        singer: tmpTitle.singer })
                    })
                    const result = await res.json()

                if (!res.ok) {
                    throw new Error(`저장 실패: ${item}`);
                }
                
            })
            );
            console.log('저장 완료');
        } catch (error) {
            console.error(error);
        }
        onClose()
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
                    minWidth: "300px",
                }}
            >

            <div
                style={{
                    position: "relative",
                    marginBottom: "20px",
                }}
            >
                <h2 
                    style={{
                        margin: 0,
                        textAlign: "center",
                    }}>북마크
                </h2>

                <button 
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                    onClick={onClose}>
                    X
                </button>
            </div>
            <div>
                
                {bookmarkGroupList.map((item) => (
                <div key={item}>
                    {item}
                    <Checkbox checked={checkedLists.includes(item)}
                    onChange={() => handleCheckboxChange(item)} 
                    />
                    <button onClick={() =>deleteList(item)}> x</button>
                </div>
                    
                ))}
            </div>  

            {saveOpen && (
                <div
                    onClick={()=> setSaveOpen(false)}
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

                                <button 
                                    onClick={()=> setSaveOpen(false)}>
                                        닫기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                <button onClick={() => setSaveOpen(true)}>새 그룹 추가</button>
                <button onClick={fetchBookmark}>저장</button>

                <h4>현재 선택 곡 : {tmpTitle.title}</h4>

            </div>
        </div>
            
    )
}