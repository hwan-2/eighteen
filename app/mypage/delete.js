"use client"
import { MdDeleteForever } from "react-icons/md";

export default async function Delete(props) {

    const deleteBookmark = async (e) => {
        if (window.confirm("북마크에서 삭제할까요?")) {
            console.log(props.item._id)
            const res = await fetch('api/post/delete',
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        _id: props.item._id,
                    }),
                }).then(() => {
                e.target.parentElement.parentElement.parentElement.style.opacity = '0'
                setTimeout(() => {
                    e.target.parentElement.parentElement.parentElement.style.display = 'none'
                }, 100)
            })
        }
        else{
            alert("취소합니다.")
        }
        
      }
    return (
        <MdDeleteForever size="30" onClick={deleteBookmark}/>
    )
}