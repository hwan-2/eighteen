"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import './main.css'
import { useEffect, useState } from 'react'
import axios from "axios"



export default function Main() {
  
  const [titleList, setTitleList] = useState([])
  const [search, setSearch] = useState("")

  useEffect(()=>{axios.get("https://api.manana.kr/karaoke.json").then((response)=>{setTitleList(response.data)})

  })

  return (
      <div className="mMain">
        <h1 className={"title"}>노래방 검색</h1>
        <h3 className={"title-sub"}>※안전한 놀이터</h3>
        <div className="search">
          <input type="text" placeholder="검색..." className="searchBar" onChange={(e)=>setSearch(e.target.value)}/>
          {titleList.filter((item)=>{
            if(search===""){
            }
            else if(item.title.toLowerCase().includes(search.toLowerCase())){
              return item
            }
          }).map((item) => {
            return <div className='' key={item.title}>제목 : {item.title}</div>
          })}
        </div>
      </div>
  )
}
  