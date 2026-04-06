import {connectDB} from "@/util/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    //id 일치여부 가져와서 마이페이지 혹은 다른 페이지에 불러오기
    if (req.method === 'GET'){
        try {
            const { id } = req.query
            if (typeof id !== 'string') {
                return res.status(400).json("오류발생: id가 string이 아님");
            }
            const db = (await connectDB).db('eighteen')
            const result = await db.collection(`users/${id}`).find().toArray()
            res.status(200).json(result)

        } catch (error) {
            console.error(error)
            res.status(500).json("오류발생: id")
        }
    }else{
        res.status(403).json("오류발생: GET")
    }
}
