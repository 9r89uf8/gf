// app/login/page.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from "@/app/services/authService";
import { useStore } from '@/app/store/store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { alpha, styled } from '@mui/material/styles';
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import { keyframes } from '@mui/system';
import { ModernCard, CompactCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(233, 69, 96, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(233, 69, 96, 0.8), 0 0 30px rgba(233, 69, 96, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(233, 69, 96, 0.5);
  }
`;

// Styled Components
const LoginContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3),
    position: 'relative',
    zIndex: 1,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '& fieldset': {
            border: 'none',
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
        },
        '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #1a1a1a',
            boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
        },
    },
    '& .MuiInputBase-input': {
        color: 'rgba(15, 23, 42, 0.95)',
        fontSize: '1.1rem',
        padding: '16px 14px',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(51, 65, 85, 0.7)',
        fontSize: '1.1rem',
        '&.Mui-focused': {
            color: '#1a1a1a',
        },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: 'rgba(51, 65, 85, 0.6)',
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    borderRadius: 12,
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    color: 'white',
    padding: '14px 32px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
    },
    '&:active': {
        transform: 'translateY(0) scale(0.98)',
    },
    '&:disabled': {
        background: 'rgba(0, 0, 0, 0.1)',
        color: 'rgba(51, 65, 85, 0.3)',
        boxShadow: 'none',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        transition: 'left 0.5s ease',
    },
    '&:hover::before': {
        left: '100%',
    },
}));

const TextButton = styled(Button)(({ theme }) => ({
    color: 'rgba(51, 65, 85, 0.8)',
    fontSize: '0.95rem',
    textTransform: 'none',
    marginTop: theme.spacing(1),
    padding: '8px 16px',
    borderRadius: 8,
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: 'rgba(15, 23, 42, 0.95)',
    },
}));

const Logo = styled('img')({
    width: 60,
    height: 'auto',
    marginBottom: 16,
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
});

const FooterCard = styled(CompactCard)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    textAlign: 'center',
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    border: '1px solid rgba(255, 0, 0, 0.2)',
    color: 'rgba(15, 23, 42, 0.95)',
    fontSize: '1rem',
    marginBottom: theme.spacing(2),
    '& .MuiAlert-icon': {
        color: '#d32f2f',
    },
}));

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userCount, setUserCount] = useState(0);
    const router = useRouter();
    const [turnstileToken, setTurnstileToken] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.turnstile) {
                window.turnstile.render('#turnstile-widget', {
                    sitekey: '0x4AAAAAAA_HdjBUf9sbezTK',
                    callback: (token) => setTurnstileToken(token),
                });
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Animated user count
        const targetCount = Math.floor(Math.random() * 500000) + 500000;
        const increment = targetCount / 100;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
                setUserCount(targetCount);
                clearInterval(timer);
            } else {
                setUserCount(Math.floor(current));
            }
        }, 20);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear any previous errors
        
        const data = { email, password, turnstileToken };
        const { user, error } = await loginUser(data);
        
        setIsLoading(false);
        
        if (user) {
            router.refresh();
            
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'user_loged_in', {
                    event_category: 'CTA',
                    event_label: 'login Button'
                });
            }
            
            router.push('/dm');
        } else {
            console.error(error);
            setError(error || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
        }
    };

    return (
        <LoginContainer>
            <Fade in={true} timeout={800}>
                <ModernCard 
                    sx={{ width: '100%', maxWidth: 440 }}
                    variant="premium"
                    animate={true}
                >
                    <CardContentWrapper>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    color: '#1a1a1a', 
                                    fontWeight: 700,
                                    mb: 1,
                                    fontSize: { xs: '2.5rem', sm: '3rem' },
                                }}
                            >
                                Bienvenido
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: 'rgba(51, 65, 85, 0.7)',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Inicia sesión para continuar
                            </Typography>
                        </Box>

                        {error && (
                            <Fade in={true} timeout={300}>
                                <StyledAlert 
                                    severity="error"
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </StyledAlert>
                            </Fade>
                        )}

                        <form onSubmit={handleLogin}>
                            <StyledTextField
                                label="Correo electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError(''); // Clear error when user types
                                }}
                                variant="outlined"
                                fullWidth
                                required
                                autoComplete="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            <StyledTextField
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError(''); // Clear error when user types
                                }}
                                variant="outlined"
                                fullWidth
                                required
                                autoComplete="current-password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: 'rgba(51, 65, 85, 0.6)' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <div id="turnstile-widget"></div>
                            </Box>

                            <GradientButton
                                type="submit"
                                fullWidth
                                disabled={isLoading}
                                variant="contained"
                                size="large"
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Iniciar sesión'
                                )}
                            </GradientButton>
                        </form>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <TextButton
                                component={Link}
                                href="/reset-password"
                            >
                                ¿Olvidaste tu contraseña?
                            </TextButton>
                            
                            <Box sx={{ mt: 2 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: 'rgba(51, 65, 85, 0.6)', mb: 1 }}
                                >
                                    ¿No tienes una cuenta?
                                </Typography>
                                <TextButton
                                    component={Link}
                                    href="/register"
                                    sx={{
                                        border: '1px solid rgba(0, 0, 0, 0.2)',
                                        '&:hover': {
                                            borderColor: 'rgba(0, 0, 0, 0.4)',
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                        }
                                    }}
                                >
                                    Crear cuenta
                                </TextButton>
                            </Box>
                        </Box>

                        <Box 
                            sx={{ 
                                mt: 4, 
                                pt: 3, 
                                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                textAlign: 'center'
                            }}
                        >
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'rgba(51, 65, 85, 0.5)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Más de {userCount.toLocaleString()} usuarios activos
                            </Typography>
                        </Box>
                    </CardContentWrapper>
                </ModernCard>
            </Fade>

            <FooterCard variant="flat" animate={false}>
                <Typography 
                    sx={{ 
                        color: 'rgba(51, 65, 85, 0.7)',
                        fontSize: '0.9rem'
                    }}
                >
                    © 2025 NoviaChat. Todos los derechos reservados.
                </Typography>
            </FooterCard>
        </LoginContainer>
    );
};

export default LoginPage;