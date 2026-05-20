"use client"
import { useMemo, useEffect, useState } from 'react'
import Delete from "./delete"
import './mypage.css'

export default function Rtpage({tableData}){

    const [brandSelect, setBrandSelect] = useState<string>("all")

    useEffect(() => {
        const saved = localStorage.getItem("brandSelect");

        if (saved) {
            setBrandSelect(saved);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("brandSelect", brandSelect);
    }, [brandSelect]);

    const brandSelectChange = (e) => {
        setBrandSelect(e.target.value);
    };


    const filteredData = tableData.filter(item => {
        if (brandSelect === "all") return true
        const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
        return item.brand === brandName
    })


    return (
        (!tableData || tableData.length === 0)?
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
                      <td><Delete item={item}/></td>
                    </tr>
                    })
                  } 
            </tbody>
        </table>

        
    )
}
