import { connectDB } from "@/util/database";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

//post 요청시 개인 페이지를 db에 생성후 그 안에 저장할 content 넣기
export default async function handler(req, res) {
    if (req.method == 'POST'){
        try {
            //실제 페이지가 만들면 주석처리부분 활성화
            //session에 있는 userId를 가져와서 하위 페이지 만들기
            let session = await getServerSession(req, res, authOptions)
            req.body = JSON.parse(req.body)
            let userId = session.user._id
            let saveThing = {
                brand: req.brand,
                no : req.body.no,
                title : req.title,
                singer : req.singer
            }

            let db = (await connectDB).db('eighteen')
            let personalPagePath = `user/${userId}`
            let result = db.collection(personalPagePath).insertOne(saveThing)

            res.status(200).json("저장완료")

        } catch (error) {
            console.error(error)
            res.status(500).json("오류발생")
        }
    }
}