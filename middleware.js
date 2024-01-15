import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req){
    const session = await getToken({req: req, secret: secret})

    //main이나 mypage 들어갈때 로그인 유무 체크
    if(req.nextUrl.pathname.startsWith('/main') || req.nextUrl.pathname.startsWith('/mypage')) {
        if (session == null) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }
    //login이나 signup 들어갈때 로그인 유무 체크
    if(req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup') || req.nextUrl.pathname == '/') {
        if (session != null) {
            return NextResponse.redirect(new URL('/main', req.url))
        }
    }

}