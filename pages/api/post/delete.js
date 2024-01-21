import {connectDB} from "@/util/database";
import {ObjectId} from "mongodb";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req,res){
    //저장 파일 삭제
    if(req.method == 'DELETE'){
        try {
            let session = await getServerSession(req, res, authOptions)
            //session 체크
            if (!session) {
                return res.status(400).json("세션 오류발생")
            }
            let userId = session.user._id
            req.body = JSON.parse(req.body)
            let postId = req.body._id
            let db = (await connectDB).db('eighteen')
            let result = await db.collection(`users/${userId}`).deleteOne({_id : new ObjectId(postId)})
            res.status(200).json("삭제완료")
        }
        catch (error){
            res.status(500).json("삭제오류발생")

        }
    }
}
