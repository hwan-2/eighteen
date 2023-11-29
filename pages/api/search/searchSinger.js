import axios from 'axios';

//가수로 검색하는 api
export default async function handler(req, res) {
    if (req.method == 'POST'){
        try {
            req.body = JSON.parse(req.body)
            const singer = req.body.singer
            const brand = req.body.brand;
            const response = await axios.get(`https://api.manana.kr/karaoke/singer/${singer}.json?brand=${brand}`);
            //json데이터로 반환
            res.status(200).json(response.data);

        } catch (error) {
            console.error('API 호출 오류:', error);
            res.status(500).json({ error: 'API 호출 오류' });
        }
    }
}