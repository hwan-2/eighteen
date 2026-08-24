"use client"
import { MdDeleteForever } from "react-icons/md";
import { useSnackbarStore } from '@/store/useSnackbarStore';
import { useConfirmStore } from '@/store/useConfirmStore';
import './mypage.css'

export default function Delete({item, onDeleteSuccess}) {
    const { showSnackbar } = useSnackbarStore();
    const { showConfirm } = useConfirmStore();

    const deleteBookmark = async () => {
        const isOk = await showConfirm("북마크에서 삭제할까요?", "북마크 삭제");
        
        if (!isOk) {
            showSnackbar("취소합니다.", "info");
            return;
        }

        const res = await fetch('/api/post/delete',
            {
                method: 'DELETE',
                body: JSON.stringify({
                    _id: item._id,
                }),
            });

        if (res.ok) {
            if (onDeleteSuccess) {
                onDeleteSuccess(item);
            }
        } else {
            showSnackbar("삭제에 실패했습니다.", "error");
        }
    };

    return (
        <MdDeleteForever size="30" className="deleteBookmark" onClick={deleteBookmark}/>
    )
}