import {connectDB} from "@/util/database";
import {ObjectId} from "mongodb";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    //저장 파일 삭제
    if(req.method === 'DELETE'){
        try {
            const session = await getServerSession(req, res, authOptions)
            //session 체크
            if (!session || !session.user) {
                return res.status(401).json("오류발생: 세션오류")
            }
            const userId = (session.user as { _id?: string })._id
            if (!userId) {
                return res.status(401).json("오류발생: 사용자 id 불명");
            }

            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
            const postId = body._id

            const db = (await connectDB).db('eighteen')
            const result = await db.collection(`users/${userId}`).deleteOne({_id : new ObjectId(postId)})
            res.status(200).json(result)
        }
        catch (error){
            res.status(500).json("오류발생: 삭제실패")

        }
    } else{
        res.status(403).json("오류발생: DELETE")
    }
}
