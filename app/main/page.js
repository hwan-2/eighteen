"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import './main.css'
import { useEffect, useState } from 'react'
import axios from "axios"
import { Checkbox } from '@mui/material'


export default function Main() {
  
  const [data, setData] = useState([])
  const [singerData, setSingerData] = useState([])
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
        body : JSON.stringify({singer:input})
      })
    const result = await res.json()
    //console.log(data)
    setSingerData(result)
    console.log(input)
    console.log(singerData)
  }

  const fetchNumber = async () => {
    const res = await fetch('api/search/searchNumber',
      {
        method: 'POST',
        body : JSON.stringify({no:input})
      })
    const result = await res.json()
    //console.log(data)
    setData(result)
    console.log(input)
    console.log(data)
  }

  const handleChange = (value) => {
    setInput(value)
    console.log(input)
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
            onInput={(e)=>handleChange(e.target.value)}
          />

          <div>
            <button onClick={fetchTitle}>검색테스트</button>
          </div>
          <div>
            <button onClick={fetchSinger}>가수테스트</button>
          </div>
          <div>
            <button onClick={fetchNumber}>번호테스트</button>
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
            {data.filter((item)=>{
                if(input===""){
                  
                }
                else if(item.title.toLowerCase().includes(input.toLowerCase())){
                  return item
                }
              })
              .map((item, index) => {
                return <tr key={index}>
                  <td>{item.brand === 'tj' && "TJ"}{item.brand === 'kumyoung' && "KY"}</td>
                  <td>{item.no}</td>
                  <td>{item.title}</td>
                  <td>{item.singer}</td>
                  <td><button>ㅇ</button></td>
                  {/* 아이콘으로 바꿀예정 */}
                  </tr>
              })}

              {singerData.filter((item)=>{
                if(input===""){
                  
                }
                else if(item.singer.toLowerCase().includes(input.toLowerCase())){
                  return item
                }
              })
              .map((item, index) => {
                return <tr key={index}>
                  <td>{item.brand}</td>
                  <td>{item.no}</td>
                  <td>{item.title}</td>
                  <td>{item.singer}</td>
                  <td><button>ㅇ</button></td>
                  {/* 아이콘으로 바꿀예정 */}
                  </tr>
              })}

              {data.filter((item)=>{
                if(input===""){
                  
                }
                else if(item.no.toLowerCase().includes(input.toLowerCase())){
                  return item
                }
              })
              .map((item, index) => {
                return <tr key={index}>
                  <td>{item.brand}</td>
                  <td>{item.no}</td>
                  <td>{item.title}</td>
                  <td>{item.singer}</td>
                  <td><button>ㅇ</button></td>
                  {/* 아이콘으로 바꿀예정 */}
                  </tr>
              })}
            </tbody>
          </table>


        </div>
      </div>
  )
}
  