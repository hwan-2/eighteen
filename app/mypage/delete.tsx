"use client"
import { MdDeleteForever } from "react-icons/md";
import './mypage.css'

export default function Delete({item, onDeleteSuccess}) {

    const deleteBookmark = async () => {
        if (window.confirm("북마크에서 삭제할까요?")) {
            const res = await fetch('/api/post/delete',
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        _id: item._id,
                    }),
                });

                if (res.ok) {
                    if (onDeleteSuccess) {
                        onDeleteSuccess(item)
                    }
                } else {
                    alert("삭제에 실패했습니다.")
                }
            }

        else{
            alert("취소합니다.")
        }
        
      }
    return (
        <MdDeleteForever size="30" className="deleteBookmark" onClick={deleteBookmark}/>
    )
}