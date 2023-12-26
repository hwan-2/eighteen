import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        //구글 로그인, 이메일 로그인
        GoogleProvider({
            clientId: process.env["GOOGLE_CLIENT_ID"],
            clientSecret: process.env["GOOGLE_CLIENT_SECRET"]
        }),

        CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "email", type: "text" },
            password: { label: "password", type: "password" },
        },
        async authorize(credentials) {
            console.log(credentials)
            let db = (await connectDB).db('eighteen');
            let user = await db.collection('user').findOne({email : credentials.email})
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
                token.user.name = user.username
                token.user.email = user.email
                token.user._id = user._id
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