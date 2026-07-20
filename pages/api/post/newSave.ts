import { connectDB } from "@/util/database";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

//post 요청시 개인 페이지를 db에 생성후 그 안에 저장할 content 넣기
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST'){
        try {
            //session에 있는 userId를 가져와서 하위 페이지 만들기
            const session = await getServerSession(req, res, authOptions)
            
            //session 체크
            if (!session || !session.user) {
                return res.status(401).json("오류발생: 세션오류")
            }

            req.body = JSON.parse(req.body)

            const userId = session.user._id
            if (!userId) {
                return res.status(401).json("오류발생: 사용자 id 불명");
            }

            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

            const saveThing = {
                type: 'song',
                listId: body.listId,
                brand: body.brand,
                no : body.no,
                title : body.title,
                singer : body.singer
            }
            
            //null 체크
            if(!saveThing.listId || !saveThing.brand || !saveThing.no || !saveThing.title || !saveThing.singer){
                return res.status(400).json("오류발생: 입력값 누락")
            }
            
            const db = (await connectDB).db('eighteen')
            const personalPagePath = `users/${userId}`

            const existingItem = await db.collection(personalPagePath).findOne({
                type: 'song',
                listId: saveThing.listId,
                brand: saveThing.brand,
                no: saveThing.no
            })

            if (existingItem) {
                return res.status(400).json("이미 해당 보관함에 저장된 곡입니다.")
            }

            const result = await db.collection(personalPagePath).insertOne(saveThing)
            
            res.status(200).json(result)

        } catch (error) {
            console.error(error)
            res.status(500).json("오류발생: 저장실패")
        }
    } else{
        res.status(403).json("오류발생: POST")
    }
}
