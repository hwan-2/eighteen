"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import styles from './SortableBookmarkList.module.css';

export type Item = {
  listId: string;
  listIndex: number;
  listName: string;
};

interface Props {
  item: Item;
  isSortable: boolean;
  groupSelectChange: (id: string) => void;
  setGroupEditOpen: React.Dispatch<React.SetStateAction<string | null>>;

  groupEditOpen: string|null,

  setRenameGroupOpen: (value: boolean) => void;
  setSelectedRenameGroup: (value: Item) => void;
  deleteList: (item: Item) => void;

}

export default function SortableBookmarkList({item, isSortable, groupSelectChange, setGroupEditOpen, groupEditOpen, setRenameGroupOpen, setSelectedRenameGroup, deleteList} : Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.listId,
    disabled: !isSortable,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    display: "inline-block",
    verticalAlign: "top",
    zIndex: (isDragging || groupEditOpen === item.listId) ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, width: "100%" }}
    >
      <button
        className={styles.sortableCard}
        onClick={() => {
          groupSelectChange(item.listId);
          setGroupEditOpen(null);
        }}
        disabled={isSortable}
      >
        <h1 style={{ fontSize: "1.2rem", margin: 0, padding: "10px", wordBreak: "keep-all", fontWeight: 600 }}>{item.listName}</h1>
      </button>
      {isSortable?
        <span
          {...attributes}
          {...listeners}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "grab",
            userSelect: "none",
            border:"none",
            outline:"none",
            background: "transparent",
            color: "#a0aec0",
            fontSize: "1.2rem"
          }}
        >
          ☰
        </span>
        :<button onClick={(e) => {e.stopPropagation(); setGroupEditOpen(groupEditOpen === item.listId ? null : item.listId); }} style={{ position: "absolute", top: 10, right: 10, border:"none", outline:"none", background: "transparent", color: "#a0aec0", fontSize: "1.2rem", cursor: "pointer"}}>
          ⋮
        </button>
      }
        
      {groupEditOpen === item.listId && (
        <div className={styles.dropdownMenu}>
          <button 
            className={styles.dropdownBtn}
            onClick={() => {setRenameGroupOpen(true); setSelectedRenameGroup(item); console.log(item)}}>
            ✏️ 수정
          </button>
          <div className={styles.divider}></div>
          <button 
            className={`${styles.dropdownBtn} ${styles.delete}`}
            onClick={() => deleteList(item)}>
            🗑️ 삭제
          </button>
        </div>
      )}
    </div>
  );
}