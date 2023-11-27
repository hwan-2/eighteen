import { connectDB } from "@/util/database";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import { ObjectId } from "mongodb";

//post 요청시 개인 페이지를 db에 생성후 그 안에 저장할 content 넣기
export default async function handler(req, res) {
    if (req.method == 'POST'){
        try {
            //실제 페이지가 만들면 주석처리부분 활성화
            //session에 있는 userId를 가져와서 하위 페이지 만들기
            let session = await getServerSession(req, res, authOptions)
            req.body = JSON.parse(req.body)
            let userId = session.user.id
            let saveThing = {
                numT : req.body.numT,
                numK : req.body.numK,
                name : req.name
            }
            // let test = new ObjectId(req.body.id)

            let db = (await connectDB).db('eighteen')
            let personalPagePath = `user/${userId}`
            let result = db.collection(personalPagePath).insertOne(saveThing)
            
            if (result.insertedCount > 0){
                res.status(200).json("저장완료")
            } else {
                console.error(error)
                res.status(500).json("오류발생")
            }


        } catch (error) {
            console.error(error)
            res.status(500).json("오류발생")
        }
    }
}