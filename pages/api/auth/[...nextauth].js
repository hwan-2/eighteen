import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions = {
    providers: [
        //우선 jwt만 사용, 추후 구글 로그인 추가할수도 있음
        CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "email", type: "text" },
            password: { label: "password", type: "password" },
        },
        async authorize(credentials) {
            let db = (await connectDB).db('forum');
            let user = await db.collection('user_cred').findOne({email : credentials.email})
            if (!user) {
                console.log('잘못된 이메일');
                return null
            }
            const pwcheck = await bcrypt.compare(credentials.password, user.password);
            if (!pwcheck) {
                console.log('잘못된 비밀번호');
                return null
            }
            return user
        }
    })
    ],

    session: {
        strategy: 'jwt',
        maxAge: 5 * 24 * 60 * 60 //5일 유지
    },

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.user = {};
                token.user.name = user.name
                token.user.email = user.email
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user;
            return session;
        },
    },

    adapter: MongoDBAdapter(connectDB),
    secret : process.env["JWT_TOKEN"]
};
export default NextAuth(authOptions);