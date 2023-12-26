import {connectDB} from "@/util/database";
export default async function handler(req, res) {
    if (req.method == 'GET'){
        try {
            const { _id } = req.query
            let db = (await connectDB).db('eighteen')
            let result = await db.collection(`user/${_id}`).find().toArray()
            res.status(200).json("호출완료")

        } catch (error) {
            console.error(error)
            res.status(500).json("오류발생")
        }
    }
}
