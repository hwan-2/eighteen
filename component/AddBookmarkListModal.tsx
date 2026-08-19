"use client"

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AddBookmarkListModal.module.css';
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

    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={styles.modalOverlay}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className={styles.modalContent}
                    >
                        <div className={styles.modalHeader}>
                            <h2 className={styles.headerTitle}>새 그룹 추가</h2>
                            <p className={styles.headerSubtitle}>새로운 북마크 그룹의 이름을 입력해주세요.</p>
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="그룹 이름을 입력하세요"
                            className={styles.inputField}
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        <div className={styles.buttonGroup}>
                            <button className={styles.cancelButton} onClick={onClose}>
                                취소
                            </button>
                            <button 
                                className={styles.saveButton} 
                                onClick={addList}
                                disabled={input.trim() === ""}
                                style={{ opacity: input.trim() === "" ? 0.5 : 1, cursor: input.trim() === "" ? "not-allowed" : "pointer" }}
                            >
                                저장
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}