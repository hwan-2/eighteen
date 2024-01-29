'use client'
import {useRouter} from "next/navigation";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import './login.css'
import { Container, FormControlLabel } from '@mui/material';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useSession, signIn, signOut } from "next-auth/react"
import GoogleButton from 'react-google-button'

export default function Login(){
    const router = useRouter()
    const login = async (e) =>{
        e.preventDefault()

        const email = e.target.email.value;
        const password = e.target.password.value;
        const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            } 
        ).then(({ok, error}) => {
            if(ok){
                router.replace('/main')
                location.reload();
            } else{
                console.log(error)
                alert("잘못된 비밀번호 혹은 아이디 입니다.");
            }
        })
        
        
        
    }
    return(
        <div className='login'>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <h1>로그인</h1>
                    <form onSubmit={login}>
                        <TextField className="TextField" label="이메일" name="email" id="email" margin="normal" fullWidth required />
                        <TextField className="TextField" label="비밀번호" name="password" id="password" margin="normal" type="password" fullWidth required/>
                        
                        {/* <FormControlLabel control={<Checkbox value="remember" color="primary"/>} label="자동 로그인"/> */}
                        
                        <Button type="submit" variant='contained' sx={{ mt:3, mb: 2}}>로그인</Button>
                    </form>
                    {/* <form onSubmit={login}>
                    <div>
                        <label htmlFor="email">사용자 이름</label>
                        <input type="email" id="email" name="email" />
                    </div>
                    <div>
                        <label htmlFor="password">비밀번호</label>
                        <input type="password" id="password" name="password" />
                    </div>
                        <button type="submit">로그인</button>
                    </form> */}
                    혹시 회원이 아니신가요? <Link href="/signup">회원가입</Link>
                </Box>

                <div className="sLogin"> 
                    <hr/>
                    <GoogleButton className="gLogin" onClick={()=> signIn('google')}/>
                    {/* 구글 로그인 */}
                </div>
            </Container>
        </div>
        
    )
}