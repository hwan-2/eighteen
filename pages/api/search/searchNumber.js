import axios from 'axios';

//번호로 검색하는 api
export default async function handler(req, res) {
    if (req.method == 'POST'){
        try {
            req.body = JSON.parse(req.body)
            const number = req.body.singer
            const response = await axios.get(`https://api.manana.kr/karaoke/no/${number}.json`);
            //response.data를 brand가 tj이거나 kumyoung인 것만 필터링
            const filteredData = response.data.filter(data => data["brand"] === "tj" || data["brand"] === "kumyoung");
            res.status(200).json(filteredData);

        } catch (error) {
            console.error('API 호출 오류:', error);
            res.status(500).json({ error: 'API 호출 오류' });
        }
    }
}