"use client"
import { MdDeleteForever } from "react-icons/md";

export default async function Delete(props) {

    const deleteBookmark = async (e) => {
        if (window.confirm("북마크에서 삭제할까요?")) {
            const res = await fetch('api/post/delete',
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