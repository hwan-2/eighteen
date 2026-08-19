"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RenameBookmarkListModal.module.css';

interface RenameListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess : () => void;
  listItem : {listId : string, listName : string, listIndex: number}
}

export default function RenameBookmarkListModal({isOpen, onClose, onSuccess, listItem} : RenameListModalProps) {
    const [input, setInput] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (value : string) => {
        setInput(value)
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

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.modalOverlay}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={styles.modalContent}
                    >
                        <div>
                            <h2 className={styles.modalTitle}>그룹명 변경</h2>
                            <p className={styles.modalSubtitle}>기존 이름: <span style={{fontWeight: 600}}>{listItem.listName}</span></p>
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="새 그룹 이름 입력"
                            value={input}
                            onChange={(e)=>handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={styles.modalInput}
                        />

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                            <button onClick={onClose} className={styles.btnCancel}>
                                취소
                            </button>
                            <button 
                                onClick={renameList}
                                disabled={!input.trim()}
                                className={styles.btnSave}
                            >
                                저장
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}