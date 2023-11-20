import axios from 'axios';

//api 출처: https://pureani.tistory.com/4997

//제목으로 검색하는 api
export const searchApiWithName = async (query) => {
    try {
        const response = await axios.get(`https://api.manana.kr/karaoke/song/wonderful.json`);
        return response.data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
};

//가수로 검색하는 api
export const searchApiWithSinger = async (query) => {
    try {
        const response = await axios.get(`https://api.manana.kr/karaoke/singer/fripside.json`);
        return response.data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
};