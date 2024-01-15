import {connectDB} from "@/util/database";
import {ObjectId} from "mongodb";

export default async function handler(req,res){
    //저장 파일 삭제
    if(req.method == 'DELETE'){
        try {
            let db = (await connectDB).db('eighteen')
            let result = await db.collection('post').deleteOne({_id : new ObjectId(req.body)})
            res.status(200).json("삭제완료")
        }
        catch (error){
            res.status(500).json("삭제오류발생")
        }
    }
}
