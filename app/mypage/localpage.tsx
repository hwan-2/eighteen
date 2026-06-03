"use client"
import { useMemo, useEffect, useState } from 'react'
import { MdDeleteForever } from "react-icons/md";
import './mypage.css'
import {getLocalBookmarks, removeBookmarkFromLocal} from "@/util/addBookmarkToLocal"

interface SongData {
    brand: string;
    no: string;
    title: string;
    singer: string;
}

export default function Localpage(){

    const [brandSelect, setBrandSelect] = useState<string>("all")
    const [bookmarkLocal, setBookmarkLocal] = useState<SongData[]>([])

    useEffect(() => {
        setBookmarkLocal(getLocalBookmarks())
    }, []);

    const brandSelectChange = (e) => {
        setBrandSelect(e.target.value);
    };

    const deleteTest = (brand : string, no : string) => {

        if (window.confirm("북마크에서 삭제할까요?")) {
            removeBookmarkFromLocal(brand, no)
            setBookmarkLocal(getLocalBookmarks())
        }
        else{
            alert("취소합니다.")
        }
    }


    const filteredData = bookmarkLocal.filter(item => {
        if (brandSelect === "all") return true
        const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
        return item.brand === brandName
    })


    return (
        (!bookmarkLocal || bookmarkLocal.length === 0)?
            <p>노래를 추가해봐요</p>
        :
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
                      <td><MdDeleteForever size="30" className="deleteBookmark" onClick={() => deleteTest(item.brand, item.no)}/></td>
                    </tr>
                    })
                  } 
            </tbody>
        </table>

        
    )
}
