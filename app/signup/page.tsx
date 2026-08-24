'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import './signup.css'
import { useSnackbarStore } from '@/store/useSnackbarStore';

//회원가입 페이지
export default function Signup(){
    const { showSnackbar } = useSnackbarStore();
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        try {
            const res = await fetch("/api/auth/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            
            if (res.ok) {
                showSnackbar(data.message || "가입을 환영합니다!", "success");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                showSnackbar(data.error || "회원가입에 실패했습니다.", "error");
            }
        } catch (error) {
            showSnackbar("오류가 발생했습니다.", "error");
        }
    };

    return(
        <div className={"signup"}>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 15,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <h1>회원가입</h1>
                    <form onSubmit={handleSubmit}>
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