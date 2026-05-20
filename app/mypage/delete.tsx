"use client"
import { MdDeleteForever } from "react-icons/md";
import './mypage.css'

export default function Delete(props) {

    const deleteBookmark = async (e) => {
        if (window.confirm("북마크에서 삭제할까요?")) {
            const res = await fetch('/api/post/delete',
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        _id: props.item._id,
                    }),
                }).then(() => {
                    console.log(e.target.closest("tr"))
                    e.target.closest("tr").style.opacity = '0'
                setTimeout(() => {
                    e.target.closest("tr").style.display = 'none'
                }, 100)
                window.location.reload()
            })
        }
        else{
            alert("취소합니다.")
        }
        
      }
    return (
        <MdDeleteForever size="30" className="deleteBookmark" onClick={deleteBookmark}/>
    )
}