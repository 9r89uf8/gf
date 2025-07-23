//register page
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from "@/app/services/authService";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { alpha, styled } from '@mui/material/styles';
import { People, Lock, Bolt, Info, EmailOutlined, PersonOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Link from 'next/link';
import { ModernCard, CompactCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

// Styled components
const RegisterContainer = styled(Box)(({ theme }) => ({
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

const RegisterButton = styled(Button)(({ theme }) => ({
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

const LoginButton = styled(Button)(({ theme }) => ({
    color: 'rgba(51, 65, 85, 0.8)',
    fontSize: '0.95rem',
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.4)',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: 'rgba(15, 23, 42, 0.95)',
    },
}));

const FeatureBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        transform: 'translateX(8px)',
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

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        color: 'rgba(15, 23, 42, 0.95)',
    },
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

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [country, setCountry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAnonymousDialog, setShowAnonymousDialog] = useState(false);
    const [showAnonymousInfo, setShowAnonymousInfo] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
        fetch('https://ipinfo.io/json?token=5a17bbfded96f7')
            .then(response => response.json())
            .then(data => {
                setCountry(data.country);
            });
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear any previous errors
        
        const data = { email, password, username, country, turnstileToken };
        const { user, error } = await registerUser(data);
        
        setIsLoading(false);
        
        if (user) {
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'user_registered', {
                    event_category: 'CTA',
                    event_label: 'Register Button'
                });
            }
            router.push('/dm');
        } else {
            console.error(error);
            setError(error || 'Error al registrar. Por favor, intenta nuevamente.');
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleAnonymousClick = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        setUsername(randomNumber);
        setEmail(`${randomNumber}@gmail.com`);
        setPassword(randomNumber);
        setIsAnonymous(true);
        setShowAnonymousDialog(true);
    };

    const handleClearAuto = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setIsAnonymous(false);
        setShowAnonymousDialog(false);
    };

    const handleCloseDialog = () => {
        setShowAnonymousDialog(false);
    };

    return (
        <RegisterContainer>
            <Fade in={true} timeout={800}>
                <ModernCard 
                    sx={{ width: '100%', maxWidth: 480 }}
                    variant="elevated"
                    animate={true}
                >
                    <CardContentWrapper>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Logo 
                                src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Untitled+design+(3).png" 
                                alt="NoviaChat Logo"
                            />
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    color: '#1a1a1a', 
                                    fontWeight: 700,
                                    mb: 1,
                                    fontSize: { xs: '2.5rem', sm: '3rem' },
                                }}
                            >
                                Crear Cuenta
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: 'rgba(51, 65, 85, 0.7)',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Únete a nuestra comunidad
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <FeatureBox>
                                <People sx={{ mr: 2, color: '#1a1a1a', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        2M+ usuarios activos
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.6)' }}>
                                        Comunidad global en crecimiento
                                    </Typography>
                                </Box>
                            </FeatureBox>
                            <FeatureBox>
                                <Lock sx={{ mr: 2, color: '#2a2a2a', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        100% anónimo y seguro
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.6)' }}>
                                        Tu privacidad es nuestra prioridad
                                    </Typography>
                                </Box>
                            </FeatureBox>
                            <FeatureBox>
                                <Bolt sx={{ mr: 2, color: '#000000', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        Mensajes encriptados
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.6)' }}>
                                        Comunicación completamente segura
                                    </Typography>
                                </Box>
                            </FeatureBox>
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

                        <form onSubmit={handleRegister}>
                            <StyledTextField
                                label="Nombre o Apodo"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (error) setError(''); // Clear error when user types
                                }}
                                variant="outlined"
                                fullWidth
                                required
                                autoComplete="username"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
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
                                autoComplete="new-password"
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

                            <RegisterButton
                                type="submit"
                                fullWidth
                                disabled={isLoading}
                                variant="contained"
                                size="large"
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Crear cuenta'
                                )}
                            </RegisterButton>
                        </form>

                        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography 
                                variant="body2" 
                                sx={{ color: 'rgba(51, 65, 85, 0.6)', mb: 1 }}
                            >
                                ¿Ya tienes una cuenta?
                            </Typography>
                            <LoginButton
                                component={Link}
                                href="/login"
                                fullWidth
                            >
                                Iniciar sesión
                            </LoginButton>
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

            {/* Anonymous Dialog */}
            <StyledDialog 
                open={showAnonymousDialog} 
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        maxWidth: 400,
                        m: 2,
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>
                        Cuenta Anónima Creada
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.8)', mb: 2 }}>
                        Se han generado credenciales temporales para tu cuenta anónima. 
                        Guarda estos datos para poder acceder nuevamente:
                    </Typography>
                    <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(0, 0, 0, 0.05)', 
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: 2
                    }}>
                        <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.7)' }}>
                            <strong>Usuario:</strong> {username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.7)' }}>
                            <strong>Email:</strong> {email}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.7)' }}>
                            <strong>Contraseña:</strong> {password}
                        </Typography>
                    </Paper>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <TextButton onClick={handleClearAuto}>
                        Cancelar
                    </TextButton>
                    <RegisterButton 
                        onClick={handleRegister}
                        sx={{ mt: 0, mb: 0 }}
                    >
                        Continuar
                    </RegisterButton>
                </DialogActions>
            </StyledDialog>
        </RegisterContainer>
    );
};

export default RegisterPage;