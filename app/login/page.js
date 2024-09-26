// app/login/page.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from "@/app/services/authService";
import { useStore } from '@/app/store/store';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { People, Lock, Bolt, TrendingUp } from '@mui/icons-material';
import Link from 'next/link';

const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: 20,
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
    },
}));

const FeatureBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    color: 'white',
}));

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disableLogin, setDisableLogin] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const router = useRouter();
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        // Simulating fetching user count
        setUserCount(Math.floor(Math.random() * 1000000) + 500000);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setDisableLogin(true);
        const { user, error } = await loginUser(email, password, setUser);
        setDisableLogin(false);
        if (user) {
            router.push('/chat');
        } else {
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2
            }}
        >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <GlassCard sx={{ width: '420px', maxWidth: '100%', marginTop: 3 }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ color: 'white', marginBottom: 3, fontWeight: 'bold' }}>
                            Ingrese a su cuenta
                        </Typography>

                        <Box sx={{ marginBottom: 3, textAlign: 'left' }}>
                            <FeatureBox>
                                <People sx={{ marginRight: 1, color: '#FE6B8B', fontSize: 36 }} />
                                <Typography variant="body1">
                                    ¡Ya somos {userCount.toLocaleString()} usuarios!
                                </Typography>
                            </FeatureBox>
                            <FeatureBox>
                                <Lock sx={{ marginRight: 1, color: '#FF8E53', fontSize: 36 }} />
                                <Typography variant="body1">
                                    100% anónimo y seguro
                                </Typography>
                            </FeatureBox>
                            <FeatureBox>
                                <Bolt sx={{ marginRight: 1, color: '#FE6B8B', fontSize: 36 }} />
                                <Typography variant="body1">
                                    Mensajes encriptados
                                </Typography>
                            </FeatureBox>
                            <FeatureBox>
                                <TrendingUp sx={{ marginRight: 1, color: '#FF8E53', fontSize: 36 }} />
                                <Typography variant="body1">
                                    ¡La app de más rápido crecimiento en LATAM!
                                </Typography>
                            </FeatureBox>
                        </Box>

                        <form onSubmit={handleLogin}>
                            <StyledTextField
                                label="Correo electrónico"
                                name="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                variant="outlined"
                                fullWidth
                                required
                            />
                            <StyledTextField
                                label="Contraseña"
                                name="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                variant="outlined"
                                type="password"
                                fullWidth
                                required
                            />
                            <GradientButton
                                type="submit"
                                variant="contained"
                                disabled={disableLogin}
                                fullWidth
                            >
                                Entrar
                            </GradientButton>
                        </form>
                        <Button
                            component={Link}
                            href="/reset-password"
                            size='medium'
                            sx={{
                                marginTop: 2,
                                color: 'white',
                                textDecoration: 'underline',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Button>
                    </CardContent>
                </GlassCard>
            </Box>

            <GlassCard sx={{ padding: 2, maxWidth: '100%', marginTop: 5 }}>
                <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Quinielas+(1).png" alt="logo" style={{width: 45, height: "auto", marginBottom: 1}}/>
                <Typography sx={{ color: 'white', fontSize:'14px' }}>
                    © 2024 - Todos los Derechos Reservados LIGA MX. Quinielas liga mx 2024-2025.
                </Typography>
            </GlassCard>
        </Box>
    );
};

export default LoginPage;

