import {connectDB} from "@/util/database";
export default async function handler(req, res) {
    //id 일치여부 가져와서 마이페이지 혹은 다른 페이지에 불러오기
    if (req.method == 'GET'){
        try {
            const { _id } = req.query
            let db = (await connectDB).db('eighteen')
            let result = await db.collection(`users/${_id}`).find().toArray()
            res.status(200).json("호출완료")

        } catch (error) {
            console.error(error)
            res.status(500).json("오류발생")
        }
    }
}
