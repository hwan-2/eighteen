import { connectDB } from "@/util/database";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
            const {username, password, email} = body

            if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string') {
                return res.status(400).json({error: "잘못된 요청 형식입니다."});
            }

            //유효성 검사 함수
            //공백 문자 확인
            const isNullOrWhitespace = (str: string) => {
                return str === null || str.match(/^\s*$/) !== null;
            };

            //특수 문자 확인
            const hasSpecialCharacters = (str: string) => {
                return /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/.test(str);
            };

            //이메일 형식 확인
            const checkEmail = (str: string) => {
                return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(str);
            }

            //비밀번호 형식 확인
            //특수문자, 대문자 1개포함한 8~16자 패스워드
            const checkPassword = (str: string) => {
                return /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/.test(str);
            }

            //유효성 검사 진행
            //공백문자 확인 및 username 특수문자 체크
            res.setHeader('Content-Type', 'text/html; charset=utf-8')

            if (isNullOrWhitespace(username) || hasSpecialCharacters(username) || isNullOrWhitespace(password) || isNullOrWhitespace(email)) {
                return res.send("<script>alert('공백 혹은 이름에 특수문자가 들어갑니다.'); history.back();</script>")
            }

            //email 형식 체크
            if (!checkEmail(email)) {
                return res.send("<script>alert('이메일 형식이 옳지 않습니다.'); history.back();</script>")
            }

            //비밀번호 형식 체크
            if (!checkPassword(password)) {
                return res.send("<script>alert('비밀번호 형식이 옳지 않습니다.'); history.back();</script>")
            }

            //email 중복 체크
            const db = (await connectDB).db('eighteen')
            const existingUser = await db.collection('users').findOne({email})

            if (existingUser) {
                return res.send("<script>alert('이미 사용 중인 이메일입니다.'); history.back();</script>")
            }

            //최종적으로 체크 후 패스워드 hash 및 회원가입 진행
            const hash = await bcrypt.hash(req.body.password, 10)
            const newUser = {
                username,
                email,
                password: hash,
            }

            await db.collection('users').insertOne(newUser);
            res.send("<script>alert('가입을 환영합니다!');location.href='/login';</script>")
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "회원가입 처리에 실패했습니다."})
        }
    } else{
        res.status(403).json("오류발생: POST")
    }
}
