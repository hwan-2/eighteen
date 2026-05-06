const STORAGE_KEY = 'guest_bookmarks';

interface SongData {
    brand: string;
    no: string;
    title: string;
    singer: string;
}

//북마크 추가
export const addBookmarkToLocal = (songData: SongData) => {
    if (typeof window === 'undefined') return

    //기존 저장된 데이터 불러오기
    const existingData = localStorage.getItem(STORAGE_KEY)
    const bookmarks: SongData[] = existingData ? JSON.parse(existingData) : []

    //중복 저장 방지인데 사실 하트 채워져 있으면 필요 없나
    const isDuplicate = bookmarks.some(
        (b) => b.brand === songData.brand && b.no === songData.no
    )
    if (isDuplicate) {
        alert("이미 추가된 곡입니다.")
        return false
    }

    bookmarks.push(songData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
    return true
}

//북마크 목록 리턴
export const getLocalBookmarks = (): SongData[] => {
    if (typeof window === 'undefined') return []

    const existingData = localStorage.getItem(STORAGE_KEY)
    return existingData ? JSON.parse(existingData) : []
}

//북마크 삭제
export const removeBookmarkFromLocal = (brand: string, no: string) => {
    if (typeof window === 'undefined') return

    const existingData = localStorage.getItem(STORAGE_KEY)
    if (!existingData) return

    const bookmarks: SongData[] = JSON.parse(existingData)
    const updatedBookmarks = bookmarks.filter(
        (b) => !(b.brand === brand && b.no === no)
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookmarks))
}