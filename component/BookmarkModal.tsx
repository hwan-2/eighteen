"use client"

import { Checkbox } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
import { FaMagnifyingGlass, FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import AddBookmarkListModal from '@/component/AddBookmarkListModal'
import styles from './BookmarkModal.module.css';


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
                    body: JSON.stringify({
                        listId: item,
                        brand: tmpTitle.brand,
                        no: tmpTitle.no,
                        title: tmpTitle.title,
                        singer: tmpTitle.singer
                    })
                })
            const result = await res.json()

            if (!res.ok) {
                // throw new Error(`저장 실패: ${item}`);
                alert(result)
            }
            onBookmarkSuccess()
        } catch (error) {
            console.error(error);
        }

    }

    const handleBookmark = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        const heart = confetti.shapeFromText({text: '♥'});

        confetti({
            particleCount: 10,
            spread: 360,
            origin: {x, y},
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    onClick={onClose}
                    className={styles.modalOverlay}
                >
                    <motion.div
                        initial={{scale: 0.9, opacity: 0, y: 20}}
                        animate={{scale: 1, opacity: 1, y: 0}}
                        exit={{scale: 0.9, opacity: 0, y: 20}}
                        transition={{type: "spring", damping: 25, stiffness: 300}}
                        onClick={(e) => e.stopPropagation()}
                        className={styles.modalContent}
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.headerText}>
                                <h2 className={styles.headerTitle}>
                                    북마크에 저장
                                </h2>
                                <p className={styles.headerSubtitle}>
                                    {tmpTitle?.title} {tmpTitle?.singer ? `- ${tmpTitle.singer}` : ''}
                                </p>
                            </div>

                            <button
                                className={styles.closeButton}
                                onClick={onClose}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.listContainer}>
                            {bookmarkGroupList.map((item) => {
                                const isBookmarked = bookmarkSet.has(`${tmpTitle.brand}-${tmpTitle.no}-${item.listId}`);
                                return (
                                    <div
                                        key={item.listIndex}
                                        className={`${styles.listItem} ${isBookmarked ? styles.listItemSelected : ''}`}
                                        onClick={(e) => {
                                            if (isBookmarked) {
                                                deleteBookmark(item.listId);
                                            } else {
                                                addBookmark(e, item.listId);
                                            }
                                        }}
                                    >
                                        <span
                                            className={`${styles.listItemText} ${isBookmarked ? styles.listItemTextSelected : ''}`}>
                                            {item.listName}
                                        </span>

                                        <motion.div whileTap={{scale: 0.8}}>
                                            {isBookmarked ? (
                                                <FaHeart
                                                    size={24}
                                                    color='#e11d48'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteBookmark(item.listId);
                                                    }}
                                                />
                                            ) : (
                                                <FaRegHeart
                                                    size={24}
                                                    className={styles.emptyHeart}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addBookmark(e, item.listId);
                                                    }}
                                                />
                                            )}
                                        </motion.div>
                                    </div>
                                );
                            })}

                            {bookmarkGroupList.length === 0 && (
                                <div className={styles.emptyText}>
                                    등록된 북마크 그룹이 없습니다.
                                </div>
                            )}
                        </div>

                        <button
                            className={styles.addButton}
                            onClick={() => setAddListOpen(true)}
                        >
                            + 새 그룹 추가
                        </button>

                        <AddBookmarkListModal
                            isOpen={addListOpen}
                            onClose={() => setAddListOpen(false)}
                            onSuccess={onSuccess}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}