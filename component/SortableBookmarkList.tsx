"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    //   {...attributes}
    //   {...listeners}
    >
      <button
        style={{
          width: "20vh",
          height: "20vh",
          borderRadius: 10,
          backgroundColor: "#919191"
        }}
        onClick={() => {
          groupSelectChange(item.listId);
          setGroupEditOpen(null);
        }}
        disabled={isSortable}
      >
        <h1>{item.listName}</h1>
      </button>
      {isSortable?
        <span
          {...attributes}
          {...listeners}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            cursor: "grab",
            userSelect: "none",
          }}
        >
          ☰
        </span>
        :<button onClick={(e) => {e.stopPropagation(); setGroupEditOpen(groupEditOpen === item.listId ? null : item.listId); }} style={{ position: "absolute", top: 6, right: 6,}}>
          ⋮
        </button>
      }
        
      {groupEditOpen === item.listId && (
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 6,
            background: "#fff",
            borderRadius: 6,
            width: "6vh",
            height: "6vh",
          }}
        >
          <div onClick={() => {setRenameGroupOpen(true), setSelectedRenameGroup(item), console.log(item)}}>수정</div>
          <div onClick={() => deleteList(item)}>삭제</div>
        </div>
      )}
    </div>
  );
}