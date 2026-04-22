"use client"
import { useEffect, useState } from 'react'
import Delete from "./delete"

export default function Rtpage({tableData}){
    return (
        (!tableData || tableData.length === 0)?
            <p>노래를 추가해봐요</p>
        :
        <table className='table'>
            <thead>
                <tr>
                    <th>제공</th>
                    <th>번호</th>
                    <th>제목</th>
                    <th>가수</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((item, index) => {
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
