import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

// 리스트 내 곡 순서 변경 함수
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

            const { listId, orderedSongIds } = body as { listId: string; orderedSongIds: string[] }

            if (!listId) {
                return res.status(400).json("오류발생: 리스트 ID 누락")
            }

            if (!orderedSongIds || !Array.isArray(orderedSongIds) || orderedSongIds.length === 0) {
                return res.status(400).json("오류발생: 잘못된 데이터 형식입니다.")
            }

            const db = (await connectDB).db('eighteen')
            const personalPagePath = `users/${userId}`

            // 각 곡의 songIndex를 배열 순서대로 재배정
            const bulkOps = orderedSongIds.map((songId, index) => {
                return {
                    updateOne: {
                        filter: {
                            _id: new ObjectId(songId),
                            type: 'song',
                            listId: listId
                        },
                        update: { $set: { songIndex: index } }
                    }
                }
            })

            const result = await db.collection(personalPagePath).bulkWrite(bulkOps)

            return res.status(200).json({
                message: "곡 순서가 성공적으로 변경되었습니다.",
                modifiedCount: result.modifiedCount
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json("오류발생: 곡 순서 변경 실패")
        }
    } else {
        return res.status(405).json("오류발생: PUT")
    }
}
