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

interface SearchData {
  brand: string;
  no: string;
  title: string;
  singer: string;
}

interface BookmarkData {
  brand: string;
  no: string;
  _id: string;
}

export default function Main() {
  
  const [data, setData] = useState<SearchData[]>([])
  const [input, setInput] = useState<string>("")
  const [select, setSelect] = useState<string>("song")
  const [columns, setColumns] = useState<string[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [bookmark, setBookmark] = useState<BookmarkData[]>([])
  const [testLogin, setTestLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  const [brandSelect, setBrandSelect] = useState<string>("all")

  const fetchTitle = async () => {
    if (!input.trim()) {
      return
    }
    setLoading(true)
    const res = await axios.post('api/search/searchTitle', {title:input})
    const result = res.data
    const musicData = result.music

    //feat. 관련 필터링
    const filterKeywords = ['f', 'e', 'a', 't', 'fe', 'ea', 'at', 'fea']
    const shouldFilter = filterKeywords.includes(input.toLowerCase())
    const filteredMusicData = shouldFilter
        ? musicData.filter(item => !item.title.toLowerCase().includes('feat.'))
        : musicData

    if(result.user){
      const bookmarkData = result.user
      setBookmark(bookmarkData)
      setTestLogin(true)
    }else{
      setBookmark([])
      setTestLogin(false)
    }
    console.log(bookmark)
    console.log(result)
    console.log("이승")
    setData(filteredMusicData)
    setColumns(["제공", "번호", "제목", "가수", "북마크"])
    setVisible(true)
    setLoading(false)
  }

  const fetchSinger = async () => {
    if (!input.trim()) {
      return
    }
    setLoading(true)
    const res = await axios.post('api/search/searchSinger', {singer:input})
    const result = res.data
    const musicData = result.music
    if(result.user){
      const bookmarkData = result.user
      setBookmark(bookmarkData)
      setTestLogin(true)
    }else{
      setBookmark([])
      setTestLogin(false)
    }
    //console.log(bookmark)
    setData(musicData)
    setColumns(["제공", "번호", "제목", "가수", "북마크"])
    setVisible(true)
    setLoading(false)
  }

  const fetchBookmark = async (item : SearchData) => {
    const res = await fetch('api/post/newSave',
      {
        method: 'POST',
        body : JSON.stringify({
          brand : item.brand,
          no: item.no,
          title: item.title,
          singer: item.singer })
      })
      searchBookmark()
    const result = await res.json()
  }


  const deleteBookmark = async (item : SearchData) => {
    const bid = bookmark.filter(v => v.brand === item.brand && v.no === item.no)
    const res = await fetch('api/post/delete',
      {
        method: 'DELETE',
          body: JSON.stringify({
          _id: bid[0]._id,
        }),
      })
      searchBookmark()
  }

  const searchBookmark = async () => {
    const res = await fetch('api/search/searchBookmark',
      {
        method: 'POST',
        body : JSON.stringify({title:input})
      })
    const result = await res.json()
    const bookmarkData = result.user
    setBookmark(bookmarkData)
  }

  const handleChange = (value : string) => {
    setInput(value)
  }

  const selectChange = (e : any) => {
    setSelect(e.target.value)
  }

  const handleKeyDown = (e : any) => {
    if (e.key === "Enter") {
      if(select === "song"){
        fetchTitle()
      }
      else{
        fetchSinger()
      }
    }
  }

  const brandSelectChange = (e : any) => {
    setBrandSelect(e.target.value)
  }

  console.time("new-version");

  const bookmarkSet = new Set(bookmark.map(v => `${v.brand}-${v.no}`))

  const filteredData = data.filter(item => {
    if (brandSelect === "all") return true
    const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
    return item.brand === brandName
  })

  console.timeEnd("new-version");

  console.time("old-version");

  const renderData = data.map((item) => {
    const isBookmarked = bookmark.filter(v => v.brand === item.brand).some(v=> v.no === item.no);
    return { ...item, isBookmarked };
  });

  console.timeEnd("old-version");

  return (
      <div className="mMain">
        <h1 className={"title"}>노래방 검색</h1>
        {/* <h3 className={"title-sub"}>※안전하지 않음</h3> */}
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
              onChange={(e)=>handleChange(e.target.value)}
              onKeyDown = {handleKeyDown}
            />
            <button className='sButton' onClick={
              select === "song"
              ? fetchTitle
              : fetchSinger
              } disabled={loading}
            ><FaMagnifyingGlass /></button>
          </div>
          {loading && (
              <div className="loading-spinner-container">
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
              </div>
          )}

          {visible
          ? data.length
            ? <table className='table'>
                <thead>
                  <tr>
                    
                    {columns.map((column) => (
                      <th key={column}>
                        {column === '제공'?
                        <select onChange={brandSelectChange} value={brandSelect} className='brandSelect'>
                          <option key="all" value="all">제공</option>
                          <option key="tj" value="tj">TJ</option>
                          <option key="ky" value="ky">금영</option>
                        </select> 
                        :column}</th>
                    ))}
                  </tr>
                </thead>
                    <tbody>
                    {filteredData.map((item) => (
                        <tr className="tr" key={`${item.brand}-${item.no}`}>
                          <td>
                            {item.brand === 'tj' && <img src="/img/tj.png" className='brand' alt="TJ" />}
                            {item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand' alt="금영" />}
                          </td>
                          <td>{item.no}</td>
                          <td>{item.title}</td>
                          <td>{item.singer}</td>
                          <td>
                            {testLogin ? (
                                bookmarkSet.has(`${item.brand}-${item.no}`) ? (
                                    <FaHeart className='fH' size={30} color='red' onClick={() => deleteBookmark(item)}/>
                                ) : (
                                    <FaRegHeart className='eH' size={30} color='red' onClick={() => fetchBookmark(item)}/>
                                )
                            ) : (
                                <FaRegHeart className='eH' size={30} color='red' onClick={() => alert("로그인 후 이용 가능 합니다")}/>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                {/*<tbody>*/}
                {/*    {brandSelect === "all" && data.map((item, index) => {*/}
                {/*    return <tr className="tr" key={index}>*/}
                {/*      <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>*/}
                {/*      <td>{item.no}</td>*/}
                {/*      <td>{item.title}</td>*/}
                {/*      <td>{item.singer}</td>*/}
                {/*      <td>*/}
                {/*      {*/}
                {/*      testLogin*/}
                {/*      ?(bookmark.filter(v => v.brand === item.brand).some(v=> v.no === item.no))*/}
                {/*        ?<FaHeart className='fH' size={30} color='red' onClick={()=>deleteBookmark(item)}/>*/}
                {/*        :<FaRegHeart className='eH' size={30} color='red' onClick={()=>fetchBookmark(item)}/>*/}
                {/*      :<FaRegHeart className='eH' size={30} color='red' onClick={()=>alert("로그인 후 이용 가능 합니다")}/>*/}

                {/*      */}
                {/*      }*/}
                {/*      </td>*/}
                {/*      /!* filter로 업체 구분 후, some으로 해당 업체의 번호 검색하여 값 존재 시 true 반환 *!/*/}
                {/*    </tr>*/}
                {/*    })*/}
                {/*  } */}
                {/*  {brandSelect === "tj" && data.filter(e => e.brand === "tj").map((item, index) => {*/}
                {/*    return <tr className="tr" key={index}>*/}
                {/*      <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>*/}
                {/*      <td>{item.no}</td>*/}
                {/*      <td>{item.title}</td>*/}
                {/*      <td>{item.singer}</td>*/}
                {/*      <td>*/}
                {/*      {*/}
                {/*      testLogin*/}
                {/*      ?(bookmark.filter(v => v.brand === item.brand).some(v=> v.no === item.no))*/}
                {/*        ?<FaHeart className='fH' size={30} color='red' onClick={()=>deleteBookmark(item)}/>*/}
                {/*        :<FaRegHeart className='eH' size={30} color='red' onClick={()=>fetchBookmark(item)}/>*/}
                {/*      :<FaRegHeart className='eH' size={30} color='red' onClick={()=>alert("로그인 후 이용 가능 합니다")}/>*/}

                {/*      */}
                {/*      }*/}
                {/*      </td>*/}
                {/*      /!* filter로 업체 구분 후, some으로 해당 업체의 번호 검색하여 값 존재 시 true 반환 *!/*/}
                {/*    </tr>*/}
                {/*    })*/}
                {/*  }*/}
                {/*  {brandSelect === "ky" && data.filter(e => e.brand === "kumyoung").map((item, index) => {*/}
                {/*    return <tr className="tr" key={index}>*/}
                {/*      <td>{item.brand === 'tj' && <img src="/img/tj.png" className='brand'></img>}{item.brand === 'kumyoung' && <img src="/img/ky.png" className='brand'></img>}</td>*/}
                {/*      <td>{item.no}</td>*/}
                {/*      <td>{item.title}</td>*/}
                {/*      <td>{item.singer}</td>*/}
                {/*      <td>*/}
                {/*      {*/}
                {/*      testLogin*/}
                {/*      ?(bookmark.filter(v => v.brand === item.brand).some(v=> v.no === item.no))*/}
                {/*        ?<FaHeart className='fH' size={30} color='red' onClick={()=>deleteBookmark(item)}/>*/}
                {/*        :<FaRegHeart className='eH' size={30} color='red' onClick={()=>fetchBookmark(item)}/>*/}
                {/*      :<FaRegHeart className='eH' size={30} color='red' onClick={()=>alert("로그인 후 이용 가능 합니다")}/>*/}

                {/*      */}
                {/*      }*/}
                {/*      </td>*/}
                {/*      /!* filter로 업체 구분 후, some으로 해당 업체의 번호 검색하여 값 존재 시 true 반환 *!/*/}
                {/*    </tr>*/}
                {/*    })*/}
                {/*  } */}
                {/*</tbody>*/}
              </table>
            : <h1>검색결과가 없습니다.</h1>
          : <h1>검색하세요</h1>
          }
        </div>
      </div>
  )
}
  