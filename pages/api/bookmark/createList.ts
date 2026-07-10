import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const session = await getServerSession(req, res, authOptions)
            if (!session || !session.user) return res.status(401).json("오류발생: 세션 오류")

            const userId = (session.user as { _id?: string })._id

            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
            const newListName = body.newListName

            if (!newListName || newListName.trim() === "") {
                return res.status(400).json("오류발생: 리스트 이름을 입력해주세요.")
            }

            const db = (await connectDB).db('eighteen')
            const personalPagePath = `users/${userId}`

            // 이미 같은 이름의 리스트가 있는지 중복 검사
            const existing = await db.collection(personalPagePath).findOne({type: 'list', listName: newListName})
            if (existing) {
                return res.status(400).json("오류발생: 이미 존재하는 보관함 이름입니다.")
            }

            //
            const lastList = await db.collection(personalPagePath)
                .find({ type: 'list' })
                .sort({ listIndex: -1 })
                .limit(1)
                .toArray()

            const nextIndex = (lastList.length > 0 && lastList[0].listIndex !== undefined)
                ? lastList[0].listIndex + 1
                : 0
            
            // 빈 데이터 생성
            const emptyFolderData = {
                type: 'list',
                listName: newListName,
                listIndex: nextIndex,
                createdAt: new Date()
            }

            const result = await db.collection(personalPagePath).insertOne(emptyFolderData)

            return res.status(200).json({ message: "새 보관함이 생성되었습니다." })

        } catch (error) {
            return res.status(500).json("생성 실패")
        }
    } else {
        return res.status(405).json("오류발생: POST")
    }
}
