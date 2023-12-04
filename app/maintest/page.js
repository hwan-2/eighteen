"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import './maintest.css'
import { useEffect, useState } from 'react'
import axios from "axios"

export default function MainTest() {
  const [titleList, setTitleList] = useState([])
  const [search, setSearch] = useState("")

  useEffect(()=>{
    axios.get("https://api.manana.kr/karaoke/kumyoung.json?limit=500")
    .then((response)=>{setTitleList(response.data)})
  },[])
  
  return (
      <div className="mMain">
        <h1 className={"title"}>노래방 검색</h1>
        <h3 className={"title-sub"}>※안전하지 않음</h3>
        <div className="search">
          <input
            type="text"
            placeholder="검색..."
            className="searchBar"
            onChange={(e)=>setSearch(e.target.value)}
          />
        
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
              
              {titleList.filter((item)=>{
                if(search===""){
                  
                }
                else if(item.title.toLowerCase().includes(search.toLowerCase())){
                  return item
                }
              })
              .map((item, index) => {
                return <tr key={index}>
                  <td>{item.brand}</td>
                  <td>{item.no}</td>
                  <td>{item.title}</td>
                  <td>{item.singer}</td>
                  </tr>
              })}
              
              
            </tbody>
          </table>


        </div>
      </div>
  )
}
  