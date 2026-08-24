'use client'

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useConfirmStore } from '@/store/useConfirmStore';

export default function GlobalConfirm() {
    const { isOpen, title, message, confirm, cancel } = useConfirmStore();

    if (!isOpen) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={cancel}
            sx={{ zIndex: 10500 }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="inherit">취소</Button>
                <Button onClick={confirm} color="error" autoFocus>확인</Button>
            </DialogActions>
        </Dialog>
    );
}
