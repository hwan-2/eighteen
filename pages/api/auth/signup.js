import { connectDB } from "@/util/database";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method === "POST") {
        
        //무결성 검사 생각나는대로 추가 예정
        //공백 문자 확인
        const isNullOrWhitespace = (str) => {
            return str === null || str.match(/^\s*$/) !== null;
        };
        //특수 문자 확인 유저 네임에만 적용?
        const hasSpecialCharacters = (str) => {
            return /[~!@#$%^&*(),.?":{}|<>]/.test(str);
        };

        const { username, password, email } = req.body;

        if (isNullOrWhitespace(username) || hasSpecialCharacters(username) || isNullOrWhitespace(password) || isNullOrWhitespace(email)) {
            return res.status(400).json({ error: "공백 혹은 이름에 특수문자가 들어갑니다" });
        }
        
        //email 중복 체크
        let db = (await connectDB).db('eighteen');
        const existingUser = await db.collection('user').findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "이미 사용 중인 이메일입니다." });
        }

        //최종적으로 체크 후 패스워드 hash 및 회원가입 진행
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        
        await db.collection('user').insertOne(req.body);
        res.status(200).json('sign_up');
    }
}; 