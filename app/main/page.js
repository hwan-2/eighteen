"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import './main.css'
import { useCallback, useEffect, useState } from 'react'
import axios from "axios"
import { Checkbox } from '@mui/material'
import { FaMagnifyingGlass, FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";




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
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])



  const fetchTitle = async () => {
    const res = await fetch('api/search/searchTitle',
      {
        method: 'POST',
        body : JSON.stringify({title:input})
      })
    const result = await res.json()
    const musicData = result.music
    const bookmarkData = result.user

    //console.log(data)
    setData(musicData)
    setBookmark(bookmarkData)
    setColumns(["제공", "번호", "제목", "가수", "북마크"])
    setVisible(true)
    console.log(input)
    console.log(bookmark)
  }

  const fetchSinger = async () => {
    const res = await fetch('api/search/searchSinger',
      {
        method: 'POST',
        body : JSON.stringify({singer:input})
      })
    const result = await res.json()
    const musicData = result.music
    const bookmarkData = result.user
    //console.log(data)
    setData(musicData)
    setBookmark(bookmarkData)
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
      }).then(
        select === "song"
        ? fetchTitle()
        : fetchSinger()
      )
    const result = await res.json()
    console.log(result)
  }


  const deleteBookmark = async (item, e) => {
    const bid = bookmark.filter(v => v.brand === item.brand && v.no === item.no)
    console.log(bid[0]._id)
    const res = await fetch('api/post/delete',
      {
        method: 'DELETE',
          body: JSON.stringify({
          _id: bid[0]._id,
        }),
      }).then(
        select === "song"
        ? fetchTitle()
        : fetchSinger()
      )
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
                    return <tr className="tr" key={index}>
                      <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>
                      <td>{item.no}</td>
                      <td>{item.title}</td>
                      <td>{item.singer}</td>
                      <td>{bookmark.filter(v => v.brand === item.brand).some(v=> v.no === item.no)
                      ?<FaHeart className='fH' size={30} color='red' onClick={(e)=>deleteBookmark(item, e)}/>
                      :<FaRegHeart className='eH' size={30} color='red' onClick={(e)=>fetchBookmark(item, e)}/>
                      }
                      </td>
                      
                      {/* filter로 업체 구분 후, some으로 해당 업체의 번호 검색하여 값 존재 시 true 반환 */}
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
  