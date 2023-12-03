"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import './main.css'
import { useEffect, useState } from 'react'
import axios from "axios"

export default function Main() {
  
  const [data, setData] = useState([])
  const [input, setInput] = useState("")
  const [records, setRecords] = useState(data)

  const fetchTitle = async () => {
    const res = await fetch('api/search/searchTitle',
      {
        method: 'POST',
        body : JSON.stringify({title:input})
      })
    const result = await res.json()
    //console.log(data)
    setData(result)
    console.log(input)
    console.log(data)
  }


  const fetchSinger = async () => {
    const res = await fetch('api/search/searchSinger',
      {
        method: 'POST',
        body : JSON.stringify({singer:""})
      })
    const data = await res.json()
    //console.log(data)

  }

  const handleChange = (value) => {
    setInput(value)
  }

  return (
      <div className="mMain">
        <h1 className={"title"}>노래방 검색</h1>
        <h3 className={"title-sub"}>※안전하지 않음</h3>
        <div className="search">
          <input
            type="text"
            placeholder="검색..."
            className="searchBar"
            value = {input}
            onChange={(e)=>handleChange(e.target.value)}
          />

          <div>
            <button onClick={fetchTitle}>hi</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>제공</th>
                <th>번호</th>
                <th>제목</th>
                <th>가수</th>
                <th>북마크</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index)=> 
                {
                  <tr key={index}>
                    <td>{item.brand}</td>
                    <td>{item.no}</td>
                    <td>{item.title}</td>
                    <td>{item.singer}</td>
                    <td>ㅇㅇ</td>
                  </tr>
                }
              )}
            </tbody>
          </table>


        </div>
      </div>
  )
}
  