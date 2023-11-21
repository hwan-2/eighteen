import { connectDB } from "@/util/database"

//post 요청시 개인 페이지에 content 넣기
export default async function handler(req, res) {
    if (req.method == 'POST'){
        try {
            let db = (await connectDB).db('forum')
            let result = db.collection('post').insertOne(req.body)
            const userId = req.body.userId;
            const personalPagePath = `/user/${userId}`;
            res.redirect(302, personalPagePath);

        } catch (error) {
            console.error('DB 에러:', error);
            res.status(500).json({ error: 'DB 에러' });
        }
    }
}