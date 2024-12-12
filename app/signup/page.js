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
                        <TextField className="TextField" label="이름" variant="filled" name="username" margin="normal" fullWidth required/>
                        <TextField className="TextField" label="이메일" variant="filled" name="email" margin="normal" fullWidth required />
                        <TextField className="TextField" label="비밀번호" variant="filled" name="password" type="password" margin="normal" fullWidth required/>
                        <Button type="submit" variant='contained' sx={{ mt:3, mb: 2}}>가입</Button>
                    </form>
                </Box>
                
            </Container>
            
        </div>
    )
}