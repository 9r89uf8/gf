'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/app/store/store';
import { getMembership } from '@/app/services/membershipService';
import { useRouter } from 'next/navigation';
import CheckoutButton from '@/app/components/payment/CheckoutButton';
import {
    Container,
    Box,
    Button,
    Typography,
    Card,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Grid,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import MessageIcon from '@mui/icons-material/Message';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const WhiteCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    color: '#212529',
    background: '#ffffff',
    borderRadius: 15,
    border: `1px solid ${alpha('#000', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
    color: '#212529',
}));

const PriceCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
    color: '#212529',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
}));

const SimpleButton = styled(Button)(({ theme }) => ({
    background: '#f8f9fa',
    border: '1px solid #ced4da',
    borderRadius: 4,
    color: '#212529',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: '#e9ecef',
    },
}));

const SafetyBox = styled(Box)(({ theme }) => ({
    background: '#f1f3f5',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
}));

const FeatureList = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const PrivateMember = () => {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const membership = useStore((state) => state.membership);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_view', {
                event_category: 'Navigation',
                event_label: 'Premium Page',
            });
        }
        getMembership();
    }, []);

    const handleLoginRedirect = () => {
        router.push('/register');
    };

    // Define supported pricing options including the full names
    const pricingOptions = [
        {
            country: 'US',
            fullName: 'Estados Unidos',
            price: membership?.priceUSD ?? 4,
            duration: membership?.duration ?? 10,
            currency: 'USD',
            name: 'dólares',
        },
        {
            country: 'MX',
            fullName: 'México',
            price: membership?.priceMXN ?? 70,
            duration: membership?.duration ?? 10,
            currency: 'MXN',
            name: 'pesos',
        },
        {
            country: 'AR',
            fullName: 'Argentina',
            price: membership?.priceARN ?? 3200,
            duration: membership?.duration ?? 10,
            currency: 'ARS',
            name: 'pesos',
        },
        {
            country: 'CO',
            fullName: 'Colombia',
            price: membership?.priceCOP ?? 15000,
            duration: membership?.duration ?? 10,
            currency: 'COP',
            name: 'pesos',
        },
        {
            country: 'PE',
            fullName: 'Perú',
            price: membership?.pricePEN ?? 20,
            duration: membership?.duration ?? 10,
            currency: 'PEN',
            name: 'soles',
        },
        {
            country: 'ES',
            fullName: 'España',
            price: membership?.priceEUR ?? 4,
            duration: membership?.duration ?? 10,
            currency: 'EUR',
            name: 'euros',
        },
    ];

    const supportedCountryCodes = pricingOptions.map((option) => option.country);
    let displayedPricingOptions = [];
    let unsupportedMessage = null;

    if (user) {
        if (!supportedCountryCodes.includes(user.country)) {
            unsupportedMessage = (
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Lo sentimos, actualmente solo soportamos los siguientes países: {pricingOptions
                    .map((option) => option.fullName)
                    .join(', ')}
                    .
                </Typography>
            );
        } else {
            displayedPricingOptions = pricingOptions.filter(
                (option) => option.country === user.country
            );
        }
    } else {
        displayedPricingOptions = pricingOptions;
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <WhiteCard elevation={4}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Cuenta Premium
                    </Typography>

                    {!user && (
                        // <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                        //     Por favor, inicie sesión o cree una cuenta para ver los precios.
                        // </Typography>
                        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                            La cuenta premium aún no está disponible. Disponible en 2026
                        </Typography>
                    )}

                    {/*{user && unsupportedMessage}*/}

                    {/*{displayedPricingOptions.length > 0 && (*/}
                    {/*    <Grid container spacing={3} justifyContent="center">*/}
                    {/*        {displayedPricingOptions.map((option) => (*/}
                    {/*            <Grid item xs={12} sm={6} key={option.country}>*/}
                    {/*                <PriceCard*/}
                    {/*                    onClick={() => setSelectedCountry(option.country)}*/}
                    {/*                    sx={{*/}
                    {/*                        border:*/}
                    {/*                            selectedCountry === option.country*/}
                    {/*                                ? '2px solid #007bff'*/}
                    {/*                                : '1px solid #ced4da',*/}
                    {/*                    }}*/}
                    {/*                >*/}
                    {/*                    <Typography variant="h6" sx={{ mb: 2 }}>*/}
                    {/*                        {option.fullName}*/}
                    {/*                    </Typography>*/}
                    {/*                    <Typography variant="h3" fontWeight="bold">*/}
                    {/*                        {option.currency === 'PEN'*/}
                    {/*                            ? 'S/'*/}
                    {/*                            : '$'}*/}
                    {/*                        {Number(option.price).toFixed(0)}*/}
                    {/*                    </Typography>*/}
                    {/*                    <Typography variant="h6" sx={{ mt: 1 }}>*/}
                    {/*                        {option.name}*/}
                    {/*                    </Typography>*/}
                    {/*                    <Typography variant="h5" mt={2} fontWeight="bold">*/}
                    {/*                        Acceso por {option.duration} días*/}
                    {/*                    </Typography>*/}
                    {/*                    <Box display="flex" justifyContent="center" mt={2}>*/}
                    {/*                        {user ? (*/}
                    {/*                            <CheckoutButton />*/}
                    {/*                        ) : (*/}
                    {/*                            <SimpleButton*/}
                    {/*                                variant="contained"*/}
                    {/*                                onClick={handleLoginRedirect}*/}
                    {/*                            >*/}
                    {/*                                Crear Cuenta*/}
                    {/*                            </SimpleButton>*/}
                    {/*                        )}*/}
                    {/*                    </Box>*/}
                    {/*                </PriceCard>*/}
                    {/*            </Grid>*/}
                    {/*        ))}*/}
                    {/*    </Grid>*/}
                    {/*)}*/}

                    {/*<SafetyBox>*/}
                    {/*    <Typography variant="h5" fontWeight="bold">*/}
                    {/*        Pago Seguro Garantizado*/}
                    {/*    </Typography>*/}
                    {/*    <Typography variant="h6">*/}
                    {/*        Tu transacción es 100% segura. Stripe.com, líder en pagos en línea,*/}
                    {/*        procesa tu pago de forma segura y confiable.*/}
                    {/*    </Typography>*/}
                    {/*</SafetyBox>*/}

                    {/*<FeatureList>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemIcon>*/}
                    {/*            <CameraAltIcon sx={{ fontSize: 40, color: '#212529' }} />*/}
                    {/*        </ListItemIcon>*/}
                    {/*        <ListItemText*/}
                    {/*            primary="Fotos Privadas"*/}
                    {/*            primaryTypographyProps={{ fontSize: '1.4rem' }}*/}
                    {/*        />*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemIcon>*/}
                    {/*            <SpatialAudioOffIcon sx={{ fontSize: 40, color: '#212529' }} />*/}
                    {/*        </ListItemIcon>*/}
                    {/*        <ListItemText*/}
                    {/*            primary="Audios ilimitados"*/}
                    {/*            primaryTypographyProps={{ fontSize: '1.4rem' }}*/}
                    {/*        />*/}
                    {/*    </ListItem>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemIcon>*/}
                    {/*            <MessageIcon sx={{ fontSize: 40, color: '#212529' }} />*/}
                    {/*        </ListItemIcon>*/}
                    {/*        <ListItemText*/}
                    {/*            primary="Mensajes ilimitados"*/}
                    {/*            primaryTypographyProps={{ fontSize: '1.4rem' }}*/}
                    {/*        />*/}
                    {/*    </ListItem>*/}
                    {/*</FeatureList>*/}

                    {/*<SimpleButton*/}
                    {/*    onClick={() => setShowPaymentInfo(!showPaymentInfo)}*/}
                    {/*    startIcon={showPaymentInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}*/}
                    {/*    fullWidth*/}
                    {/*    sx={{ mt: 2 }}*/}
                    {/*    variant="contained"*/}
                    {/*>*/}
                    {/*    {showPaymentInfo ? 'Ocultar' : 'Mostrar'} Información de Pago*/}
                    {/*</SimpleButton>*/}

                    {/*<Collapse in={showPaymentInfo}>*/}
                    {/*    <Box mt={2} p={2} bgcolor="#e9ecef" borderRadius={2}>*/}
                    {/*        <Typography variant="h6" gutterBottom>*/}
                    {/*            Seguridad en el Pago*/}
                    {/*        </Typography>*/}
                    {/*        <Typography variant="h6" paragraph>*/}
                    {/*            Tu seguridad es nuestra prioridad. Todos los pagos son procesados de*/}
                    {/*            manera segura por Stripe.*/}
                    {/*        </Typography>*/}
                    {/*        <Typography variant="h6" paragraph>*/}
                    {/*            No almacenamos ningún dato de tarjetas de crédito en nuestros servidores.*/}
                    {/*            Stripe se encarga de todo, garantizando la seguridad y confidencialidad de*/}
                    {/*            tu información.*/}
                    {/*        </Typography>*/}
                    {/*        <Button*/}
                    {/*            variant="outlined"*/}
                    {/*            startIcon={<LockIcon />}*/}
                    {/*            href="https://stripe.com"*/}
                    {/*            target="_blank"*/}
                    {/*            fullWidth*/}
                    {/*            sx={{ color: '#212529', borderColor: '#212529' }}*/}
                    {/*        >*/}
                    {/*            Más información en stripe.com*/}
                    {/*        </Button>*/}
                    {/*    </Box>*/}
                    {/*</Collapse>*/}
                </WhiteCard>
            </Container>
        </Box>
    );
};

export default PrivateMember;


