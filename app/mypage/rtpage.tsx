"use client"
import { useMemo, useEffect, useState } from 'react'
import Delete from "./delete"
import './mypage.css'
import AddBookmarkListModal from '@/component/AddBookmarkListModal'

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

    useEffect(() => {
        if(tableData) {
            setBookmarkData(tableData)
            console.log(tableData)
        }
    }, [tableData])

    useEffect(() => {
        fetchGroups();
    }, []);


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
    };

    const backChange = () => {
        setGroupSelect("")
        setSelectedGroup(false)
    }

    const handleDeleteSuccess = (deletedItem) => {
        setBookmarkData(data =>
            data.filter(item => !(item._id === deletedItem._id))
        )
    }

    const filteredData = bookmarkData.filter(item => {
        if (brandSelect === "all") return item.listId === groupSelect && item.title
        const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
        return item.brand === brandName && item.listId === groupSelect && item.title
    })


    return (
        <div>
            <>그룹 선택</>

            {!selectedGroup?
                <div>
                    {bookmarkGroupList.map((item)=> {
                        return <button key={item.listIndex} onClick={() => groupSelectChange(item.listId)} >
                            {item.listName}
                        </button>
                    })}
                    <button onClick={() => setAddListOpen(true)}>+</button>
                </div> :
                <div>
                    <button onClick={backChange}>뒤로가기</button>
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
