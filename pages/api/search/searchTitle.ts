import axios from 'axios';
import {connectDB} from "@/util/database";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

//제목으로 검색하는 api
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST'){
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
            if (!body.title || typeof body.title !== 'string') {
                return res.status(400).json({ error: '잘못된 요청 형식입니다.' })
            }
            const title = body.title.replace(/\s/g, '')
            const brands = ['kumyoung', 'tj'];

            const response = await Promise.all(
                brands.map(brand =>
                    axios.get(`https://api.manana.kr/karaoke/song/${title}.json?brand=${brand}`)
                )
            )
            
            //session을 이용한 user가 가지고 있는 마이페이지 데이터를 가져오기 위한 방법
            const session = await getServerSession(req, res, authOptions)
            //session 체크
            const db = (await connectDB).db('eighteen')
            if (!session) {
                const responseData = {
                    music: response.map(res => res.data).flat(),
                }
                responseData.music.sort((a, b) => a.title.localeCompare(b.title));
                res.status(200).json(responseData)
            } else {
                const userId = (session.user as { _id?: string })._id
                const resultUser = await db.collection(`users/${userId}`).find().toArray()
                const filteredData = resultUser.map(({brand, no, _id}) => ({brand, no, _id}))
                //user데이터와 검색 데이터를 묶어서 보냄 + _id도 보냄
                const responseData = {
                    music: response.map(res => res.data).flat(),
                    user: filteredData
                }
                responseData.music.sort((a, b) => a.title.localeCompare(b.title))
                res.status(200).json(responseData);
            }
        } catch (error) {
            console.error('API 호출 오류:', error)
            res.status(500).json({ error: 'API 호출 오류' })
        }
    } else{
        res.status(403).json("오류발생: POST")
    }
}
