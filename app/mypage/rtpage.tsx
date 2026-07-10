"use client"
import { useMemo, useEffect, useState } from 'react'
import Delete from "./delete"
import './mypage.css'

export default function Rtpage({tableData}){

    const [brandSelect, setBrandSelect] = useState<string>("all")
    const [bookmarkData, setBookmarkData] = useState(tableData || [])
    const [bookmarkGroupList, setBookmarkGroupList] = useState<string[]>([])
    const [groupSelect, setGroupSelect] = useState<string>("")

    useEffect(() => {
        if(tableData) {
            setBookmarkData(tableData)
            console.log(tableData)
        }
    }, [tableData])

    useEffect(() => {
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

        fetchGroups();
    }, []);

    const brandSelectChange = (e) => {
        setBrandSelect(e.target.value);
    };

    const groupSelectChange = (e) => {
        setGroupSelect(e.target.value);
    };

    const handleDeleteSuccess = (deletedItem) => {
        setBookmarkData(data =>
            data.filter(item => !(item.brand === deletedItem.brand && item.no === deletedItem.no))
        )
    }

    const filteredData = bookmarkData.filter(item => {
        if (brandSelect === "all") return item.listName === groupSelect && item.title
        const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
        return item.brand === brandName && item.listName === groupSelect && item.title
    })


    return (
        (!bookmarkData || bookmarkData.length === 0)?
            <p>그룹을 만들고 노래를 추가해봐요</p>
        :
        <div>
            <>그룹 선택</>

            <select onChange={groupSelectChange} value={groupSelect} className='brandSelect'>
                {bookmarkGroupList.map((item)=> {
                return <option key={item} value={item} style={{display:"flex", justifyContent:"center", flexDirection:"row"}}>
                            {item}
                        </option>
                })}
            </select>
            {/* {bookmarkGroupList.map((item)=> {
                return <div key={item} style={{display:"flex", justifyContent:"center", flexDirection:"row"}}>
                        <div>{item}</div>
                        <button onChange={() => setGroupSelect(item)}>o</button>
                    </div>
            })} */}

            {filteredData.length===0?
            <div>이 그룹에 노래를 추가해보세요</div>:
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
            }
        </div>
    )
}
