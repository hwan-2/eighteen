'use client'

import { Snackbar, Alert } from '@mui/material';
import { useSnackbarStore } from '@/store/useSnackbarStore';

export default function GlobalSnackbar() {
    const { open, message, severity, hideSnackbar } = useSnackbarStore();

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        hideSnackbar();
    };

    return (
        <Snackbar 
            open={open} 
            autoHideDuration={3000} 
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ zIndex: 11000 }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
