"use client"

export default async function Delete(props) {

    
    const deleteBookmark = async () => {
        if (window.confirm("북마크에서 삭제할까요?")) {
            console.log(props.item._id)
            const res = await fetch('api/post/delete',
            {
                method: 'DELETE',
                body: JSON.stringify({
                    _id : props.item._id,
                }),
            })
        }
        else{
            alert("취소합니다.")
        }
        
      }
    return (
        <button onClick={deleteBookmark}>ㅇ</button>
    )
}