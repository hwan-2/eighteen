import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import './signup.css'

//회원가입 페이지
export default function Signup(){

    return(
        <div className={"signup"}>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <h1>회원가입</h1>
                    <form method="POST" action="/api/auth/signUp">
                        <TextField label="이름" name="username" margin="normal" fullWidth required/>
                        <TextField label="이메일" name="email" margin="normal" fullWidth required />
                        <TextField label="비밀번호" name="password" type="password" margin="normal" fullWidth required/>
                        <Button type="submit">가입</Button>
                    </form>
                </Box>
                
            </Container>
            
        </div>
    )
}