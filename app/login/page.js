import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import './login.css'
import { Container, FormControlLabel } from '@mui/material';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

export default function Login(){
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
                    <TextField label="이메일" name="email" margin="normal" fullWidth required />
                    <TextField label="비밀번호" name="password" margin="normal" type="password" fullWidth required/>
                    
                    <FormControlLabel control={<Checkbox value="remember" color="primary"/>} label="자동 로그인"/>
                    
                    <Button type="submit" variant='contained' sx={{ mt:3, mb: 2}}>로그인</Button>
                    <Link>비밀번호를 잊으셨습니까?</Link>
                    <Link href="/signup">회원가입</Link>
                </Box>
            </Container>
        </div>
        
    )
}