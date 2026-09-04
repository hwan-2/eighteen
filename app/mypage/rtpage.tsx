"use client"
import { useMemo, useEffect, useState, useRef } from 'react'
import Delete from "./delete"
import './mypage.css'
import AddBookmarkListModal from '@/component/AddBookmarkListModal'
import RenameBookmarkListModal from '@/component/RenameBookmarkListModal'
import { closestCenter, DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Tooltip } from '@mui/material';
import { CSS } from "@dnd-kit/utilities";

import SortableBookmarkList from "@/component/SortableBookmarkList";
import { useSnackbarStore } from '@/store/useSnackbarStore';
import { useConfirmStore } from '@/store/useConfirmStore';

import styles from './rtpage.module.css';

const ClientOnlyTooltip = ({ children, ...props }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return children;
    }

    return <Tooltip {...props}>{children}</Tooltip>;
};


interface BookmarkGroupList {
    listId : string;
    listName : string;
    listIndex : number;
}

interface SongList {
    brand : string;
    listId : string;
    no : string;
    singer : string;
    songIndex : number;
    title : string;
    type : string;
    _id : string;
}

export default function Rtpage({tableData}){

    // const [brandSelect, setBrandSelect] = useState<string>("all")
    const [bookmarkData, setBookmarkData] = useState(tableData || [])
    const [bookmarkGroupList, setBookmarkGroupList] = useState<BookmarkGroupList[]>([])
    const [groupSelect, setGroupSelect] = useState<string>("")
    const [selectedGroup, setSelectedGroup] = useState<boolean>(false)
    const [addListOpen, setAddListOpen] = useState(false);
    const [groupEditOpen, setGroupEditOpen] = useState<string|null>(null);
    const [renameGroupOpen, setRenameGroupOpen] = useState(false);
    const [selectedRenameGroup, setSelectedRenameGroup] = useState<BookmarkGroupList>({listId:"", listName:"", listIndex:0})
    const [isSortable, setIsSortable] = useState(false);

    const { showSnackbar } = useSnackbarStore();
    const { showConfirm } = useConfirmStore();

    useEffect(() => {
        if(tableData) {
            setBookmarkData(tableData)
        }
    }, [tableData])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            }
        })
    );

    const sortedItems = useMemo(
        () => [...bookmarkGroupList].sort((a, b) => a.listIndex - b.listIndex),
        [bookmarkGroupList]
    );


    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        const oldIndex = sortedItems.findIndex((item) => item.listId === active.id);
        const newIndex = sortedItems.findIndex((item) => item.listId === over.id);

        const reordered = arrayMove(sortedItems, oldIndex, newIndex);

        const updated = reordered.map((item, index) => ({
        ...item,
        listIndex : index,
        }));


        setBookmarkGroupList(updated);
        // console.log(bookmarkGroupList)
        //console.log(songList)
        await updateGroupOrder(updated);

    };

    const handleDragEndSongs = async ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        const oldIndex = filteredData.findIndex((item) => item._id === active.id);
        const newIndex = filteredData.findIndex((item) => item._id === over.id);

        const reordered = arrayMove(filteredData, oldIndex, newIndex);

        const updated = reordered.map((item, index) => ({
        ...item,
        songIndex : index,
        }));
        // console.log("active:", active.id);
        // console.log("over:", over?.id);

        setBookmarkData((prev) =>
            prev.map((item) => {
                if (!("_id" in item)) {
                    return item;
                }

                const updatedItem = updated.find(
                    (song) => song._id === item._id
                );

                return updatedItem ?? item;
            })
        );
        await updateSongOrder(updated);

    };


    useEffect(() => {
        fetchGroups();
    }, []);

    const updateGroupOrder = async (items) => {
        await fetch("/api/bookmark/reorderBookmark", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderedListIds: items.map((item) => item.listId),
            }),
        });
    };

    const updateSongOrder = async (items) => {
        await fetch("/api/bookmark/reorderSongs", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                listId: items[0].listId,
                orderedSongIds: items.map(item => item._id),
            }),
        })
    }


    const fetchGroups = async () => {
        try {
            const res = await fetch("/api/bookmark/listsGet");
            const data = await res.json();

            setBookmarkGroupList(data);

            if (data.length > 0) {
                setGroupSelect(data[0]);
            }
        } catch (error) {
            console.error("그룹 목록 조회 실패:", error);
        }
    };

    // const brandSelectChange = (e) => {
    //     setBrandSelect(e.target.value);
    // };

    const groupSelectChange = (value) => {
        setGroupSelect(value);
        setSelectedGroup(true);
        window.history.pushState({ groupOpen: true }, "", "#group");
    };

    const backChange = () => {
        setGroupSelect("");
        setSelectedGroup(false);
        if (window.location.hash === "#group") {
            window.history.back();
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            if (window.location.hash !== "#group") {
                setGroupSelect("");
                setSelectedGroup(false);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleDeleteSuccess = (deletedItem) => {
        setBookmarkData(data =>
            data.filter(item => !(item._id === deletedItem._id))
        )
    }

    const deleteList = async (item) => {
        const isOk = await showConfirm(`정말로 '${item.listName}' 그룹을 삭제하시겠습니까?`, "그룹 삭제");
        
        if (!isOk) {
            showSnackbar("취소합니다.", "info");
            return;
        }

        const res = await fetch(`api/bookmark/deleteLists?listId=${encodeURIComponent(item.listId)}`,
        {
            method: 'DELETE',
        })

        if (res.ok) {
            setGroupEditOpen(null);
            fetchGroups();
            showSnackbar("삭제되었습니다.", "success");
        } else {
            showSnackbar("삭제에 실패했습니다.", "error");
        }
    }

    const filteredData : SongList[] = bookmarkData.filter(item => {
        //if (brandSelect === "all") return item.listId === groupSelect && item.title
        return item.listId === groupSelect && item.title
        //const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
        //return item.brand === brandName && item.listId === groupSelect && item.title
    }).sort((a, b) => a.songIndex - b.songIndex);


    return (
        <div style={{ padding: "20px 0" }}>
            {!selectedGroup && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
                    <h2 className={styles.rtTopTitle}>
                        그룹 선택
                    </h2>
                    <button 
                        className={`${styles.rtTopBtn} ${isSortable ? styles.active : ''}`}
                        onClick={() => {setIsSortable((prev) => !prev); setGroupEditOpen(null)}}>
                        {isSortable ? "편집 완료" : "순서 변경"}
                    </button>
                </div>
            )}
            


            {!selectedGroup?
                <div>
                    {/* {bookmarkGroupList.map((item)=> {
                        return <div key={item.listIndex} style={{position: "relative", display: "inline-block", margin: "5px", verticalAlign: "top",}}>
                            <RenameBookmarkListModal
                                isOpen={renameGroupOpen}
                                onClose={() => setRenameGroupOpen(false)}
                                onSuccess={fetchGroups}
                                listItem={selectedRenameGroup}
                            />

                            <button style={{width:'20vh', height: '20vh', borderRadius: 10,}}  onClick={() => {groupSelectChange(item.listId); setGroupEditOpen(null)}} >
                                {item.listName}
                            </button>
                            <button onClick={(e) => {e.stopPropagation(); setGroupEditOpen(groupEditOpen === item.listId ? null : item.listId); }} style={{ position: "absolute", top: 6, right: 6,}}>
                                ⋮
                            </button>
                            {groupEditOpen === item.listId && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 36,
                                        right: 6,
                                        background: "#fff",
                                        borderRadius: 6,
                                        width: '6vh',
                                        height: '6vh',
                                    }}
                                >
                                    <div onClick={() => {setRenameGroupOpen(true), setSelectedRenameGroup(item), console.log(item)}}>수정</div>
                                    <div onClick={() => deleteList(item)}>삭제</div>
                                </div>
                            )}
                            
                        </div>
                    })} */}
                    <div className={styles.modernGridWrapper}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sortedItems.map((item) => item.listId)}
                                strategy={rectSortingStrategy}
                            >
                                <div className={styles.modernGrid}>
                                    {sortedItems.map((item) => (
                                        <SortableBookmarkList
                                            key={item.listId}
                                            item={item}
                                            isSortable={isSortable}
                                            groupSelectChange={groupSelectChange}
                                            setGroupEditOpen={setGroupEditOpen}
                                            groupEditOpen={groupEditOpen}
                                            setRenameGroupOpen={setRenameGroupOpen}
                                            setSelectedRenameGroup={setSelectedRenameGroup}
                                            deleteList={deleteList}
                                        />
                                        
                                    ))}

                                    <ClientOnlyTooltip 
                                        title={bookmarkGroupList.length >= 10 ? "최대 10개까지만 생성할 수 있습니다." : "새 그룹 추가"} 
                                        placement="top" 
                                        arrow
                                        slotProps={{
                                            popper: {
                                                sx: {
                                                    zIndex: 10000,
                                                }
                                            },
                                            tooltip: {
                                                sx: {
                                                    fontSize: '1rem',
                                                    padding: '10px 14px'
                                                }
                                            }
                                        }}
                                    >
                                        <span>
                                            <button 
                                                className={styles.modernAddBtn}
                                                onClick={(e) => {
                                                    if (bookmarkGroupList.length >= 10) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    setAddListOpen(true);
                                                }}
                                                style={{
                                                    opacity: bookmarkGroupList.length >= 10 ? 0.5 : 1,
                                                    cursor: bookmarkGroupList.length >= 10 ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                <h1 style={{ fontSize: "3rem", margin: 0, fontWeight: 300 }}>+</h1>
                                            </button>
                                        </span>
                                    </ClientOnlyTooltip>
                                </div>
                            </SortableContext>
                        </DndContext>
                        
                        {/* <pre>{JSON.stringify(sortedItems, null, 2)}</pre> */}
                    </div>
                    <RenameBookmarkListModal
                        isOpen={renameGroupOpen}
                        onClose={() => setRenameGroupOpen(false)}
                        onSuccess={fetchGroups}
                        listItem={selectedRenameGroup}
                    />

                    {/* <button style={{width: "20vh", height: "20vh", borderRadius: 10, margin: "5px", verticalAlign: "top",}} onClick={() => setAddListOpen(true)}>+</button> */}
                </div> :
                <div>
                    <div style={{ width: "80%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: "20px" }}>
                        <h2 className={styles.rtLowerTitle}>
                            {bookmarkGroupList.find(g => g.listId === groupSelect)?.listName || "그룹"}
                        </h2>
                        <button 
                            className={styles.rtBackBtn}
                            onClick={backChange}
                        >
                            목록 <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>→</span>
                        </button>
                    </div>
                    {bookmarkData.some(item => item.listId === groupSelect && item.type === "song")? // 선택한 그룹에 저장된 노래가 있는지 없는지 판단

                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEndSongs}
                        >
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>
                                            {/* <select onChange={brandSelectChange} value={brandSelect} className='brandSelect'>
                                                <option key="all" value="all">제공</option>
                                                <option key="tj" value="tj">TJ</option>
                                                <option key="ky" value="ky">금영</option>
                                            </select> */}
                                        제공</th>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>가수</th>
                                        <th>삭제</th>
                                    </tr>
                                </thead>

                                <SortableContext
                                    items={filteredData.map((item) => item._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {/* <tbody>
                                        {filteredData.map((item, index) => {
                                            return <tr className="tr" key={index}  >
                                            <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>
                                            <td>{item.no}</td>
                                            <td>{item.title}</td>
                                            <td>{item.singer}</td>
                                            <td><Delete item={item} onDeleteSuccess={handleDeleteSuccess}/></td>
                                            </tr>
                                            })
                                        } 
                                    </tbody> */}
                                    <tbody>
                                        {filteredData.map((item) => (
                                            <SortableRow key={item._id} item={item} onDeleteSuccess={handleDeleteSuccess} />
                                        ))}
                                    </tbody>
                                </SortableContext>

                            </table>

                        </DndContext>
                        :
                        <div>이 그룹에는 아직 노래가 없어요</div>
                    }
                    
                </div>
            }
            
            <AddBookmarkListModal
                isOpen={addListOpen}
                onClose={() => setAddListOpen(false)}
                onSuccess={fetchGroups}
            />

        </div>
    )
}


function SortableRow({ item, onDeleteSuccess }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: item._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr ref={setNodeRef} style={style} >
            <td className='drag-handle' {...attributes} {...listeners}>⠿</td>
            <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>
            <td>{item.no}</td>
            <td>{item.title}</td>
            <td>{item.singer}</td>
            <td><Delete item={item} onDeleteSuccess={onDeleteSuccess}/></td>
        </tr>
    );
}
