"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import './main.css'
import { useCallback, useEffect, useState } from 'react'
import axios from "axios"
import { FaMagnifyingGlass, FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {addBookmarkToLocal, removeBookmarkFromLocal, getLocalBookmarks} from  '@/util/addBookmarkToLocal'
import BookmarkModal from '@/component/BookmarkModal'

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
  listId : string;
}

interface BookmarkGroupList {
  listId : string;
  listName : string;
  listIndex : number;
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
  const [bookmarkLocal, setBookmarkLocal] = useState<SearchData[]>([])

  const [bookmarkGrouplist, setBookmarkGroupList] = useState<BookmarkGroupList[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tmpTitle, setTmpTitle] = useState<SearchData>({brand:"", no:"",title:"", singer:""}); 

  useEffect(() => {
    //console.log(getLocalBookmarks());
    setBookmarkLocal(getLocalBookmarks())
    //console.log(bookmarkLocal)
  }, []);

  const addTest = (e, item : SearchData) => {
    handleBookmark(e)
    addBookmarkToLocal(item)
    setBookmarkLocal(getLocalBookmarks())
  }

  const deleteTest = (brand : string, no : string) => {
    removeBookmarkFromLocal(brand, no)
    setBookmarkLocal(getLocalBookmarks())
  }

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
          listName : "e",
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

  const bookmarkSet = new Set(bookmark.map(v => `${v.brand}-${v.no}`))
  const bookmarkLocalSet =  new Set(bookmarkLocal.map(v => `${v.brand}-${v.no}`))

  const filteredData = data.filter(item => {
    if (brandSelect === "all") return true
    const brandName = brandSelect === "tj" ? "tj" : "kumyoung"
    return item.brand === brandName
  })

  const handleBookmark = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    const heart = confetti.shapeFromText({ text: '♥' });
  
    confetti({
      particleCount: 10,
      spread: 360,
      origin: { x, y },
      colors: ['#ff0000', '#ff4d4d', '#ff8080'],
      startVelocity: 5,
      shapes: [heart],
      ticks: 20,
      gravity: -0.1,
      scalar: 0.7,
      drift: 0,
    });

  };

  const addBookmark = (e, item) => {
    handleBookmark(e)
    fetchBookmark(item);
  }


  const openModal = async (item : SearchData) => {
    fetchList();

    setTmpTitle(item);
    setIsOpen(true);
    //console.log(bookmarkGrouplist)
    console.log(bookmark)
  };

  const fetchList = async () => {
    const res = await fetch("/api/bookmark/listsGet");
    const data = await res.json();
    //console.log(data)

    setBookmarkGroupList(data);
  }

  // const addList = async () => {
  //   const res = await fetch('api/bookmark/createList',
  //     {
  //       method: 'POST',
  //       body : JSON.stringify({
  //         newListName : "5",
  //         })
  //     })
  // }

  return (
      <div className="mMain">
        <h1 className={"title"}>노래방 검색</h1>
        {/* <h3 className={"title-sub"}>※안전하지 않음</h3> */}
        <div className="search">

        <BookmarkModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          bookmarkGroupList={bookmarkGrouplist}
          tmpTitle={tmpTitle}
          onSuccess={fetchList}
          bookmark={bookmark}
          onBookmarkSuccess={searchBookmark}
        />

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
                             <AnimatePresence mode="wait">
                              <motion.div
                                key={testLogin ? bookmarkSet.has(`${item.brand}-${item.no}`) ? "liked" : "unliked" :
                               bookmarkLocalSet.has(`${item.brand}-${item.no}`) ? "liked" : "unliked"}
                                  initial={{ scale: 0.8, opacity: 0.5 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 1 }}
                                  whileTap={{ scale: 0.9 }}
                                  transition={{ type: "tween", duration: 0.05,}}
                                >
                                {testLogin ? 
                                  (
                                    <button onClick={() => openModal(item)}>이</button>
                                    
                                  )
                                : (
                                    bookmarkLocalSet.has(`${item.brand}-${item.no}`) ? (
                                      <FaHeart 
                                        className='fH' 
                                        size={30} 
                                        color='red' 
                                        onClick={() => deleteTest(item.brand, item.no)}
                                      />

                                  ) : (
                                    <FaRegHeart 
                                      className='eH'
                                      size={30}
                                      color='red'
                                      onClick={(e) => addTest(e, item)}/>
                                  )
                                )
                                }
                              </motion.div>
                            </AnimatePresence>
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
  