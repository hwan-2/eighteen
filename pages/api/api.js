import axios from 'axios';

//search api를 분리시켰으니 이걸로 작업 안해도됨
//삭제 예정
//api 출처: https://pureani.tistory.com/4997

//제목으로 검색하는 api
export const searchApiWithTitle = async (title, brand) => {
    try {
        const response = await axios.get(`https://api.manana.kr/karaoke/song/${title}.json?brand=${brand}`);
        return response.data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
};

//가수로 검색하는 api
export const searchApiWithSinger = async (singer, brand) => {
    try {
        const response = await axios.get(`https://api.manana.kr/karaoke/singer/${singer}.json?brand=${brand}`);
        return response.data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
};

//번호로 검색하는 api
export const searchApiWithNumber = async (number, brand) => {
    try {
        const response = await axios.get(`https://api.manana.kr/karaoke/no/${number}.json?brand=${brand}`);
        return response.data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
};
