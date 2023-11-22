import { connectDB } from "@/util/database";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method === "POST") {

        const { username, password, email } = req.body;

        //유효성 검사 함수
        //공백 문자 확인
        const isNullOrWhitespace = (str) => {
            return str === null || str.match(/^\s*$/) !== null;
        };
        
        //특수 문자 확인
        const hasSpecialCharacters = (str) => {
            return /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/.test(str);
        };

        //이메일 형식 확인
        const checkEmail = (str) => {
            return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(str);
        }
        
        //비밀번호 형식 확인
        //특수문자, 대문자 1개포함한 8~16자 패스워드
        const checkPassword = (str) => {
            return /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/.test(str);
        }

        //유효성 검사 진행
        //공백문자 확인 및 username 특수문자 체크
        if (isNullOrWhitespace(username) || hasSpecialCharacters(username) || isNullOrWhitespace(password) || isNullOrWhitespace(email)) {
            console.log('공백 혹은 이름에 특수문자가 들어갑니다.');
            return res.status(400).json({ error: "공백 혹은 이름에 특수문자가 들어갑니다."});
        }

        //email 형식 체크
        if (checkEmail(email) != true) {
            console.log('이메일 형식이 옳지 않습니다.');
            return res.status(400).json({error: "이메일 형식이 옳지 않습니다."})
        }

        //비밀번호 형식 체크
        if (checkPassword(password) != true) {
            console.log('비밀번호 형식이 옳지 않습니다.');
            return res.status(400).json({error: "비밀번호 형식이 옳지 않습니다."})
        }
        
        //email 중복 체크
        let db = (await connectDB).db('eighteen');
        const existingUser = await db.collection('user').findOne({ email });

        if (existingUser) {
            console.log('이미 사용 중인 이메일입니다.');
            return res.status(400).json({ error: "이미 사용 중인 이메일입니다."});
        }

        //최종적으로 체크 후 패스워드 hash 및 회원가입 진행
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        
        await db.collection('user').insertOne(req.body);
        res.status(200).json('sign_up');
    }
}; 