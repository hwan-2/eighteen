import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "email", type: "text" },
            password: { label: "password", type: "password" },
        },
        async authorize(credentials) :Promise<any> {
            if (!credentials?.email || !credentials?.password) {
                console.log('이메일 또는 비밀번호가 입력되지 않았습니다.')
                return null
            }
            const db = (await connectDB).db('eighteen');
            const user = await db.collection('users').findOne({email : credentials.email})
            if (!user) {
                console.log('오류발생: 잘못된 이메일');
                return null
            }
            const pwcheck = await bcrypt.compare(credentials.password, user.password);
            if (!pwcheck) {
                console.log('오류발생: 잘못된 비밀번호');
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
                token.user = {
                    name: user.name,
                    email: user.email,
                    _id: user.id
                };
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user as any;
            return session;
        },
    },

    adapter: MongoDBAdapter(connectDB),
    secret : process.env.NEXTAUTH_SECRET
};
export default NextAuth(authOptions);