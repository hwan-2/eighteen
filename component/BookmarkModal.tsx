"use client"

import { Checkbox } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
import { FaMagnifyingGlass, FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import AddBookmarkListModal from '@/component/AddBookmarkListModal'


interface SearchData {
  brand: string;
  no: string;
  title: string;
  singer: string;
}

interface BookmarkGroupList {
    listId : string;
    listName : string;
    listIndex : number;
}

interface BookmarkData {
    brand: string;
    no: string;
    _id: string;
    listId : string;
}


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkGroupList : BookmarkGroupList[];
  tmpTitle : SearchData;
  onSuccess : () => void;
  bookmark : BookmarkData[];
  onBookmarkSuccess : () => void;
}


export default function BookmarkModal({isOpen, onClose, bookmarkGroupList, tmpTitle, onSuccess, bookmark, onBookmarkSuccess} : ModalProps) {

    const [addListOpen, setAddListOpen] = useState(false);
    const bookmarkSet = new Set(bookmark.map(v => `${v.brand}-${v.no}-${v.listId}`))

    // const deleteList = async (item) => {
    //     const res = await fetch(`api/bookmark/deleteLists?listId=${encodeURIComponent(item)}`,
    //     {
    //         method: 'DELETE',
    //     })

    //     const result = await res.json()
    //     if (!res.ok) {
    //         console.log(result)
    //         console.log(item)
    //     }
    //     onSuccess()
    // }

    const fetchBookmark = async (item) => {
        try {
            const res = await fetch('api/post/newSave',
                {
                    method: 'POST',
                    body : JSON.stringify({
                    listId : item,
                    brand : tmpTitle.brand,
                    no: tmpTitle.no,
                    title: tmpTitle.title,
                    singer: tmpTitle.singer })
                })
            const result = await res.json()

            if (!res.ok) {
                // throw new Error(`저장 실패: ${item}`);
                alert(result)
            }
            console.log('저장 완료');
            onBookmarkSuccess()
        } catch (error) {
            console.error(error);
        }
        
    }

    const handleBookmark = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        const heart = confetti.shapeFromText({ text: '♥' });
      
        confetti({
          particleCount: 10,
          spread: 360,
          origin: { x, y },
          colors: ['#ff0000', '#ff4d4d', '#ff8080'],
          startVelocity: 5,
          shapes: [heart],
          ticks: 20,
          gravity: -0.1,
          scalar: 0.7,
          drift: 0,
        });
    
    };

    const addBookmark = (e, item) => {
        handleBookmark(e)
        fetchBookmark(item);
    }

    const deleteBookmark = async (item) => {
        const bid = bookmark.filter(v => v.brand === tmpTitle.brand && v.no === tmpTitle.no && v.listId === item)
        const res = await fetch('api/post/delete',
        {
            method: 'DELETE',
            body: JSON.stringify({
            _id: bid[0]._id,
            }),
        })
        onBookmarkSuccess()
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
                <div key={item.listIndex}>
                    {item.listName}
                    {/* <button onClick={() => fetchBookmark(item.listId)}>s</button> */}
                    {
                        bookmarkSet.has(`${tmpTitle.brand}-${tmpTitle.no}-${item.listId}`) ? (
                            <FaHeart 
                                className='fH' 
                                size={30} 
                                color='red' 
                                onClick={() => deleteBookmark(item.listId)}
                            />
                        ) : (
                            <FaRegHeart 
                                className='eH' 
                                size={30} 
                                color='red' 
                                onClick={(e) => addBookmark(e, item.listId)}
                            />
                        )
                    }

                    {/* <button onClick={() =>deleteList(item.listId)}> x</button> */}
                </div>
                    
                ))}
            </div>  

            <AddBookmarkListModal
                isOpen={addListOpen}
                onClose={() => setAddListOpen(false)}
                onSuccess={onSuccess}
            />
            {/* {saveOpen && (
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
            )} */}

                <button onClick={() => setAddListOpen(true)}>새 그룹 추가</button>
                

                <h4>현재 선택 곡 : {tmpTitle.title}</h4>

            </div>
        </div>
            
    )
}