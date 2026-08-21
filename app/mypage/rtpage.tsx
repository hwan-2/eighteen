"use client"
import { useMemo, useEffect, useState, useRef } from 'react'
import Delete from "./delete"
import './mypage.css'
import AddBookmarkListModal from '@/component/AddBookmarkListModal'
import RenameBookmarkListModal from '@/component/RenameBookmarkListModal'
import { closestCenter, DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy, arrayMove, } from "@dnd-kit/sortable";

import SortableBookmarkList from "@/component/SortableBookmarkList";


import styles from './rtpage.module.css';

interface BookmarkGroupList {
    listId : string;
    listName : string;
    listIndex : number;
}

export default function Rtpage({tableData}){

    const [brandSelect, setBrandSelect] = useState<string>("all")
    const [bookmarkData, setBookmarkData] = useState(tableData || [])
    const [bookmarkGroupList, setBookmarkGroupList] = useState<BookmarkGroupList[]>([])
    const [groupSelect, setGroupSelect] = useState<string>("")
    const [selectedGroup, setSelectedGroup] = useState<boolean>(false)
    const [addListOpen, setAddListOpen] = useState(false);
    const [groupEditOpen, setGroupEditOpen] = useState<string|null>(null);
    const [renameGroupOpen, setRenameGroupOpen] = useState(false);
    const [selectedRenameGroup, setSelectedRenameGroup] = useState<BookmarkGroupList>({listId:"", listName:"", listIndex:0})
    const [isSortable, setIsSortable] = useState(false);

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

        const oldIndex = sortedItems.findIndex(
        (item) => item.listId === active.id
        );

        const newIndex = sortedItems.findIndex(
        (item) => item.listId === over.id
        );

        const reordered = arrayMove(sortedItems, oldIndex, newIndex);

        const updated = reordered.map((item, index) => ({
        ...item,
        listIndex : index,
        }));


        setBookmarkGroupList(updated);
        await updateGroupOrder(updated);

    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const updateGroupOrder = async (items) => {
        // const payload = {
        //     orderedListIds: items.map((item) => item.listId),
        // };

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

    const brandSelectChange = (e) => {
        setBrandSelect(e.target.value);
    };

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

        if (window.confirm(item.listName + " 그룹을 삭제할까요?")) {
            const res = await fetch(`api/bookmark/deleteLists?listId=${encodeURIComponent(item.listId)}`,
            {
                method: 'DELETE',
            })

            if (res.ok) {
                    setGroupEditOpen(null);
                    fetchGroups();
                } else {
                    alert("삭제에 실패했습니다.")
            }
        }
        else{
            alert("취소합니다.")
        }
        
    }

    const filteredData = bookmarkData.filter(item => {
        if (brandSelect === "all") return item.listId === groupSelect && item.title
        const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
        return item.brand === brandName && item.listId === groupSelect && item.title
    })


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

                                    <button 
                                        className={styles.modernAddBtn}
                                        onClick={() => setAddListOpen(true)}>
                                        <h1 style={{ fontSize: "3rem", margin: 0, fontWeight: 300 }}>+</h1>
                                    </button>
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
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>
                                        <select onChange={brandSelectChange} value={brandSelect} className='brandSelect'>
                                            <option key="all" value="all">제공</option>
                                            <option key="tj" value="tj">TJ</option>
                                            <option key="ky" value="ky">금영</option>
                                        </select>
                                    </th>
                                    <th>번호</th>
                                    <th>제목</th>
                                    <th>가수</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => {
                                    return <tr className="tr" key={index}>
                                    <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>
                                    <td>{item.no}</td>
                                    <td>{item.title}</td>
                                    <td>{item.singer}</td>
                                    <td><Delete item={item} onDeleteSuccess={handleDeleteSuccess}/></td>
                                    </tr>
                                    })
                                } 
                            </tbody>
                        </table>
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
