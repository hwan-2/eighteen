import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

// 리스트 목록(노래목록 아님) 받는 함수
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const session = await getServerSession(req, res, authOptions)

            if (!session || !session.user) {
                return res.status(400).json("오류발생: 세션 오류")
            }

            const userId = (session.user as { _id?: string })._id

            const db = (await connectDB).db('eighteen')

            // const uniqueLists = await db.collection(`users/${userId}`).distinct("listName")
            const lists = await db.collection(`users/${userId}`).aggregate([
                { $sort: { createdAt: 1 } }, 
                
                { $group: { 
                    _id: "$listName", 
                    createdAt: { $first: "$createdAt" } 
                }},
                
                { $sort: { createdAt: 1 } }
                ]).toArray()

            const uniqueLists = lists.map(list => list._id).filter(Boolean)

            return res.status(200).json(uniqueLists)

        } catch (error) {
            return res.status(500).json("오류발생: 목록 불러오기 실패")
        }
    } else {
        return res.status(405).json("오류발생: GET")
    }
}
