import { useSession, signIn, signOut } from 'next-auth/react'
import './main.css'

export default function Main() {
  return (
      <div className="mMain">
        <h1 className={"title"}>노래방 검색</h1>
        <h3 className={"title-sub"}>※안전한 놀이터</h3>
        <div className="search">
          <input type="text" className="searchBar"/>
          
        </div>
      </div>
  )
}
  