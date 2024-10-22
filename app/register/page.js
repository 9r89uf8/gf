'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from "@/app/services/authService";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { People, Lock, Bolt } from '@mui/icons-material';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';

const AnonymousButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #80ed99 30%, #57cc99 90%)',
    border: 0,
    borderRadius: 25,
    fontSize: 18,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'black',
    height: 48,
    padding: '0 20px',
    margin: '10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #5a5a5a 30%, #3b3b3b 90%)',
    },
}));

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
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    border: 0,
    borderRadius: 25,
    fontSize: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
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
        fontSize: '1.4rem',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.5rem',
    },
    '& .MuiInputLabel-shrink': {
        fontSize: '1.1rem',
    },
}));

const FeatureBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    color: 'white',
}));

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [country, setCountry] = useState('');
    const [disableRegister, setDisableRegister] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const router = useRouter();
    let data = { email, password, username, country };

    useEffect(() => {
        fetch('https://ipinfo.io/json?token=5a17bbfded96f7')
            .then(response => response.json())
            .then(data => {
                setCountry(data.country);
            });
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            alert("Por favor, acepta los términos y condiciones.");
            return;
        }
        setDisableRegister(true);
        const { user, error } = await registerUser(data);
        setDisableRegister(false);
        if (user) {
            router.push('/dm');
        } else {
            console.error(error);
        }
    };

    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogOpen = () => {
        setOpenDialog(true);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const [openTermsDialog, setOpenTermsDialog] = useState(false);
    const handleTermsDialogOpen = () => {
        setOpenTermsDialog(true);
    };
    const handleTermsDialogClose = () => {
        setOpenTermsDialog(false);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2
            }}
        >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <GlassCard sx={{ width: '420px', maxWidth: '100%', marginTop: 3 }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ color: 'white', marginBottom: 3, fontWeight: 'bold' }}>
                            Crear Cuenta
                        </Typography>

                        <Box sx={{ marginBottom: 3, textAlign: 'left' }}>
                            <FeatureBox>
                                <People sx={{ marginRight: 1, color: '#FE6B8B', fontSize: 45 }} />
                                <Typography variant="h6">
                                    2M+ usuarios
                                </Typography>
                            </FeatureBox>
                            <FeatureBox>
                                <Lock sx={{ marginRight: 1, color: '#FF8E53', fontSize: 45 }} />
                                <Typography variant="h6">
                                    100% anónimo y seguro
                                </Typography>
                            </FeatureBox>
                            <FeatureBox>
                                <Bolt sx={{ marginRight: 1, color: '#FE6B8B', fontSize: 45 }} />
                                <Typography variant="h6">
                                    Mensajes encriptados
                                </Typography>
                            </FeatureBox>
                        </Box>

                        <AnonymousButton onClick={handleDialogOpen}>
                            ¿Crear Cuenta Secreta?
                        </AnonymousButton>

                        {/* Secret Account Dialog */}
                        <Dialog
                            open={openDialog}
                            onClose={handleDialogClose}
                            aria-labelledby="secret-account-dialog-title"
                            maxWidth="sm"
                            fullWidth
                            PaperProps={{
                                style: {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white',
                                    borderRadius: 15,
                                    border: `1px solid ${alpha('#ffffff', 0.2)}`,
                                },
                            }}
                        >
                            <DialogTitle id="secret-account-dialog-title" sx={{ textAlign: 'center', fontSize: '2rem' }}>
                                Crear una Cuenta Secreta
                            </DialogTitle>
                            <DialogContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginTop: 2 }}>
                                    ¿Cómo crear una cuenta secreta?
                                </Typography>
                                <Typography variant="h6" paragraph>
                                    1. Utilice un correo electrónico falso o temporal para mantener su identidad en secreto.
                                </Typography>
                                <Typography variant="h6" paragraph>
                                    2. Cree una contraseña única y segura.
                                </Typography>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginTop: 2 }}>
                                    Beneficios de una cuenta secreta
                                </Typography>
                                <Typography variant="h6" paragraph>
                                    • Mantenga su identidad completamente anónima.
                                </Typography>
                                <Typography variant="h6" paragraph>
                                    • Proteja su privacidad y seguridad en línea.
                                </Typography>
                                <Typography variant="h6" paragraph>
                                    • Disfrute de conversaciones cifradas y seguras.
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ justifyContent: 'center' }}>
                                <Button onClick={handleDialogClose} color="primary" variant="contained">
                                    Cerrar
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Terms and Conditions Dialog */}
                        <Dialog
                            open={openTermsDialog}
                            onClose={handleTermsDialogClose}
                            aria-labelledby="terms-dialog-title"
                            maxWidth="md"
                            fullWidth
                            PaperProps={{
                                style: {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white',
                                    borderRadius: 15,
                                    border: `1px solid ${alpha('#ffffff', 0.2)}`,
                                },
                            }}
                        >
                            <DialogTitle id="terms-dialog-title" sx={{ textAlign: 'center', fontSize: '2rem' }}>
                                Términos y Condiciones
                            </DialogTitle>
                            <DialogContent>
                                {/* Insert your terms and conditions content here */}
                                <Typography variant="h6" gutterBottom>
                                    Bienvenido a NoviaChat.com
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Al usar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones.
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Seguridad
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Nos comprometemos a proteger tus datos personales y garantizar la seguridad de tu información.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso,
                                    incluyendo su nombre de usuario y contraseña. Cualquier actividad realizada bajo su cuenta será su responsabilidad.
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Datos de Usuario y de Chicas
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    La información proporcionada por los usuarios y las chicas es confidencial y no será compartida con terceros.
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Datos de Pago
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Toda la información de pago es procesada de manera segura y encriptada.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Al proporcionar sus datos de pago, usted garantiza que está legalmente autorizado para
                                    utilizar el método de pago presentado.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Todos los datos de pago ingresados en nuestra plataforma son procesados a través de sistemas de pago seguros y
                                    certificados que cumplen con los estándares PCI DSS.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    La información de su tarjeta de crédito/débito nunca será almacenada en nuestros servidores.
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Imágenes Generadas por IA
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Todas las imágenes en este sitio web son generadas por Inteligencia Artificial y no representan personas reales.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Al continuar, confirmas que has leído y aceptas estos términos y condiciones.
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ justifyContent: 'center' }}>
                                <Button onClick={handleTermsDialogClose} color="primary" variant="contained">
                                    Cerrar
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <form onSubmit={handleRegister} style={{ marginTop: 15 }}>
                            <StyledTextField
                                label="Nombre Falso o Apodo"
                                name="name"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                variant="outlined"
                                fullWidth
                                required
                            />
                            <StyledTextField
                                label="Correo Electrónico"
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

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        name="terms"
                                        required
                                        sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                    />
                                }
                                label={
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        Acepto los{' '}
                                        <Link
                                            onClick={handleTermsDialogOpen}
                                            sx={{ color: '#FE6B8B', cursor: 'pointer' }}
                                        >
                                            términos y condiciones
                                        </Link>
                                    </Typography>
                                }
                            />

                            <GradientButton
                                type="submit"
                                disabled={disableRegister}
                            >
                                Crear Cuenta
                            </GradientButton>
                        </form>
                    </CardContent>
                </GlassCard>
            </Box>

            <GlassCard sx={{ padding: 2, maxWidth: '100%', marginTop: 5 }}>
                <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Untitled+design+(3).png" alt="logo" style={{ width: 45, height: "auto", marginBottom: 1 }} />
                <Typography sx={{ color: 'white', fontSize: '20px' }}>
                    © 2024 - Todos los Derechos Reservados NoviaChat. NoviaChat 2025.
                </Typography>
            </GlassCard>
        </Box>
    );
};

export default RegisterPage;
