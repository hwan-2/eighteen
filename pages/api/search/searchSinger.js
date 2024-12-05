import axios from 'axios';
import {connectDB} from "@/util/database";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

//가수로 검색하는 api
export default async function handler(req, res) {
    if (req.method == 'POST'){
        try {
            const singer = req.body.singer.replace(/\s/g, '')
            const response = await axios.get(`https://api.manana.kr/karaoke/singer/${singer}.json?brand=kumyoung,tj`);

            //session을 이용한 user가 가지고 있는 마이페이지 데이터를 가져오기 위한 방법
            let session = await getServerSession(req, res, authOptions)
            //session 체크

            let db = (await connectDB).db('eighteen')
            if (!session) {
                const responseData = {
                    music: response.data,
                }
    
                res.status(200).json(responseData);
                // return res.status(400).json("세션 오류발생")
            } else {
                let userId = session.user._id
                let resultUser = await db.collection(`users/${userId}`).find().toArray()
                const filteredData = resultUser.map(({brand, no, _id}) => ({brand, no, _id}))
                //user데이터와 검색 데이터를 묶어서 보냄
                const responseData = {
                    music: response.data,
                    user: filteredData
                }
    
                res.status(200).json(responseData);
            }
            
            

        } catch (error) {
            console.error('API 호출 오류:', error);
            res.status(500).json({ error: 'API 호출 오류' });
        }
    }
}