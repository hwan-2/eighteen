import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

// 특정 리스트를 삭제하는 함수
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const session = await getServerSession(req, res, authOptions)

            if (!session || !session.user) {
                return res.status(401).json("오류발생: 세션오류")
            }

            const userId = (session.user as { _id?: string })._id
            if (!userId) {
                return res.status(401).json("오류발생: 사용자 id 불명")
            }

            // 리스트 네임 받기
            const listName = req.query.listName as string

            if (!listName) {
                return res.status(400).json("오류발생: 삭제할 리스트 이름이 없습니다.")
            }

            const db = (await connectDB).db('eighteen')
            const personalPagePath = `users/${userId}`

            const result = await db.collection(personalPagePath).deleteMany({
                listName: listName
            })

            if (result.deletedCount === 0) {
                return res.status(444).json("삭제할 데이터가 없습니다.")
            }

            return res.status(200).json({
                message: "리스트가 삭제되었습니다.",
                deletedCount: result.deletedCount
            })

        } catch (error) {
            return res.status(500).json("오류발생: 삭제 실패")
        }
    } else {
        return res.status(405).json("오류발생: DELETE")
    }
}
