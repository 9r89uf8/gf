'use client';

import React, { useState } from 'react';
import { Button, TextField, Box, Card, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { passwordReset } from '@/app/services/authService';

import {alpha, styled} from "@mui/material/styles";


const GlassCard = styled(Card)({
    textAlign: 'center',
    marginTop: 15,
    color: 'black',
    background: '#ffffff', // semi-transparent white
    backdropFilter: 'blur(10px)', // apply blur
    borderRadius: 10, // rounded corners
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
});

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'black',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    padding: '6px 16px',
    margin: '4px',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    '&.selected': {
        background: 'rgba(255, 255, 255, 0.5)',
    },
}));

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await passwordReset(email);
        setIsLoading(false);
    };

    return (
        <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" height="100vh">
            <GlassCard sx={{ width: '330px', maxWidth: '500px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', p: 1 }}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%" textAlign="center">
                    <Typography variant="h5">Solicitud de nueva contraseña</Typography>
                    <Typography variant="subtitle1">Introduce tu correo electrónico</Typography>


                    <form onSubmit={handleSubmit}>
                        <Box component="div" mt={2}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                style={{color: 'black'}}
                                inputProps={{ style: { color: 'black' } }}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="correo electrónico"
                                variant="outlined"
                                InputLabelProps={{
                                    sx: { color: 'black' } // Apply white color to label
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <LockOutlinedIcon color="primary" />
                                    ),
                                }}
                                sx={{
                                    '& label.Mui-focused': {
                                        color: 'black', // Color of the label when the TextField is focused
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'black', // Color of the border in normal state
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'black', // Color of the border when the TextField is focused
                                        },
                                        '& input': {
                                            color: 'black', // Color of the input text
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <Box component="div" mt={2}>
                            <GradientButton type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Enviar"}
                            </GradientButton>
                        </Box>
                    </form>
                </Box>
            </GlassCard>
        </Box>
    );
};

export default ResetPassword;
