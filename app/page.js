import Link from "next/link";
import './globals.css'

//메인 페이지
export default function Home() {
  return (
      <div className="ad">
        <div className="banner">
          <img src="/test7.png"></img>
        </div>
        <h1 className={"title"}>지금 즉시 가입하세요!</h1>
        <div className={"mtitle"}>
          <Link href={"/signup"}><button className={"mButton"} value={"회원가입"}>회원가입</button></Link>
        </div>
      </div>
  )
}
