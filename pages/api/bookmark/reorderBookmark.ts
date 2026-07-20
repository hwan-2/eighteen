import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import {ObjectId} from "mongodb";

//리스트 순서 바꾸는 함수
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const session = await getServerSession(req, res, authOptions)
            if (!session || !session.user) return res.status(401).json("오류발생: 세션 오류")

            const userId = session.user._id
            if (!userId) {
                return res.status(400).json("오류발생: 사용자 ID 누락")
            }

            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

            const orderedListIds: string[] = body.orderedListIds

            if (!orderedListIds || !Array.isArray(orderedListIds)) {
                return res.status(400).json("오류발생: 잘못된 데이터 형식입니다.")
            }

            const db = (await connectDB).db('eighteen')
            const personalPagePath = `users/${userId}`

            const bulkOps = orderedListIds.map((listId, index) => {
                return {
                    updateOne: {
                        filter: { _id: new ObjectId(listId), type: 'list' },
                        update: { $set: { listIndex: index } }
                    }
                }
            })

            const result = await db.collection(personalPagePath).bulkWrite(bulkOps)

            return res.status(200).json({
                message: "순서가 성공적으로 변경되었습니다.",
                modifiedCount: result.modifiedCount
            })

        } catch (error) {
            return res.status(500).json("오류발생: 순서 변경 실패")
        }
    } else {
        return res.status(405).json("오류발생: PUT")
    }
}