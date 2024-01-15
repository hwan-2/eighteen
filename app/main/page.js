"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import './main.css'
import { useEffect, useState } from 'react'
import axios from "axios"
import { Checkbox } from '@mui/material'
import { FaMagnifyingGlass } from "react-icons/fa6";



// const OPTIONS = [
// 	{ value: "songTitle", name: "노래" },
// 	{ value: "artist", name: "가수" },
// ];

// const SelectBox = (props) => {
// 	const handleChange = (e) => {
// 		console.log(e.target.value)
// 	}

// 	return (
// 		<select onChange={handleChange}>
// 			{props.options.map((option) => (
// 				<option
// 					key={option.value}
// 					value={option.value}
// 					defaultValue={props.defaultValue === option.value}
// 				>
// 					{option.name}
// 				</option>
// 			))}
// 		</select>
// 	);
// };


export default function Main() {
  
  const [data, setData] = useState([])
  const [singerData, setSingerData] = useState([])
  const [input, setInput] = useState("")
  const [select, setSelect] = useState("song")
  const [columns, setColumns] = useState([])
  const [visible, setVisible] = useState(false)
  const [bookmark, setBookmark] = useState([])


  const fetchTitle = async () => {
    const res = await fetch('api/search/searchTitle',
      {
        method: 'POST',
        body : JSON.stringify({title:input})
      })
    const result = await res.json()
  
    //console.log(data)
    setData(result)
    setColumns(["제공", "번호", "제목", "가수", "북마크"])
    setVisible(true)
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
    setData(result)
    setColumns(["제공", "번호", "제목", "가수", "북마크"])
    setVisible(true)
    console.log(input)

  }

  const fetchBookmark = async (item, e) => {
    console.log(item.brand)
    const res = await fetch('api/post/newSave',
      {
        method: 'POST',
        body : JSON.stringify({
          brand : item.brand,
          no: item.no,
          title: item.title,
          singer: item.singer })
      })
    const result = await res.json()
    console.log(result)
  }



  // const fetchNumber = async () => {
  //   const res = await fetch('api/search/searchNumber',
  //     {
  //       method: 'POST',
  //       body : JSON.stringify({no:input})
  //     })
  //   const result = await res.json()
  //   //console.log(data)
  //   setData(result)
  //   console.log(input)
  //   console.log(data)
  // }

  const handleChange = (value) => {
    setInput(value)
    console.log(input)
  }

  const selectChange = (e) => {
    setSelect(e.target.value)
    console.log(select)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if(select === "song"){
        fetchTitle()
        console.log("노래검색")
      }
      else{
        fetchSinger()
        console.log("가수검색")
      }
    }
  }

  const bookmarktest = (item, e) => {
    console.log(item)
    alert("버튼")
  }


  return (
      <div className="mMain">
        <h1 className={"title"}>노래방 검색</h1>
        <h3 className={"title-sub"}>※안전하지 않음</h3>
        <div className="search">

          <div className="sSearch">
            <select onChange={selectChange} value={select} className='select'>
              <option key="song" value="song">노래</option>
              <option key="artist" value="artist">가수</option>
            </select>
            {/* <SelectBox options={OPTIONS}></SelectBox> */}
            <input
              type="text"
              placeholder="검색..."
              className="searchBar"
              value = {input}
              onInput={(e)=>handleChange(e.target.value)}
              onKeyDown = {handleKeyDown}
            />
            <button className='sButton' onClick={
              select === "song"
              ? fetchTitle
              : fetchSinger
              }
            ><FaMagnifyingGlass /></button>
          </div>
          {visible
          ? data.length
            ? <table className='table'>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                    return <tr key={index}>
                      <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>
                      <td>{item.no}</td>
                      <td>{item.title}</td>
                      <td>{item.singer}</td>
                      <td><button onClick={(e)=>fetchBookmark(item, e)}>ㅇ</button></td>
                      {/* 아이콘으로 바꿀예정 */}
                    </tr>
                    })
                  } 
                </tbody>
              </table>
            : <h1>검색결과가 없습니다.</h1>
          : <h1>검색하세요</h1>
          }
        </div>
      </div>
  )
}
  