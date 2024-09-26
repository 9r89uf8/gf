'use client';
import React, { useState } from 'react';
import { useStore } from '@/app/store/store';
import CheckoutButton from "@/app/components/payment/CheckoutButton";
import {
    Container,
    Box,
    Button,
    Typography,
    Card,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
} from '@mui/material';
import { styled, alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from '@mui/icons-material/Lock';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import MessageIcon from '@mui/icons-material/Message';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const GlassCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    marginTop: 15
}));

const PriceBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
    color: 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
}));

const FeatureList = styled(List)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(2),
}));

const CenteredBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
});

const SafetyBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.1),
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const PrivateMember = () => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);

    const allowedCountries = ['US', 'MX', 'AR'];

    const calculatePrice = () => {
        if (user && girl) {
            const pricingMap = {
                'MX': { price: girl.memberPrice * 17, currency: 'MXN', name: 'pesos', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(5).png' },
                'AR': { price: girl.memberPrice * 800, currency: 'ARS', name: 'pesos', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(6).png' },
                'US': { price: girl.memberPrice, currency: 'USD', name: 'dólares', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(7).png' },
            };
            return pricingMap[user.country] || pricingMap['US'];
        } else {
            return [
                { price: 4, currency: 'USD', name: 'dólares', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(7).png' },
                { price: 70, currency: 'MXN', name: 'pesos', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(5).png' }
            ];
        }
    };

    const priceInfo = calculatePrice();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2
            }}
        >
            <Container maxWidth="sm">
                <GlassCard elevation={4}>
                    <CenteredBox mb={2}>
                        <Avatar
                            src={girl ? `https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}` : ''}
                            sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        <Typography variant="h4">
                            {girl ? girl.username : 'Username'} <CheckCircleIcon sx={{ verticalAlign: 'middle', ml: 1 }} />
                        </Typography>
                        <Typography variant="h6" color="text.primary">
                            Miembro Privado
                        </Typography>
                    </CenteredBox>

                    <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

                    <PriceBox>
                        {Array.isArray(priceInfo) ? (
                            priceInfo.map((price, index) => (
                                <Box key={index} textAlign="center" mb={index === 0 ? 2 : 0}>
                                    <PriceTypography variant="h4" gutterBottom fontWeight="bold">
                                        ${price.price.toFixed(0)} {price.currency}
                                    </PriceTypography>
                                    <Avatar src={price.flag} sx={{ mt: 1, width: 30, height: 20, mx: 'auto' }} variant="rounded" />
                                </Box>
                            ))
                        ) : (
                            <>
                                <PriceTypography variant="h4" gutterBottom fontWeight="bold">
                                    ${priceInfo.price.toFixed(0)} {priceInfo.currency}
                                </PriceTypography>
                                <Avatar src={priceInfo.flag} sx={{ mt: 1, width: 30, height: 20 }} variant="rounded" />
                            </>
                        )}
                        <PriceTypography variant="h5" mt={2} fontWeight="bold">
                            Acceso por 15 días
                        </PriceTypography>
                    </PriceBox>

                    <SafetyBox>
                        <Typography variant="h5" fontWeight="bold">
                            Pago Seguro Garantizado
                        </Typography>
                        <Typography variant="h6">
                            Tu transacción es 100% segura. Stripe.com, líder en pagos en línea, procesa tu pago de forma segura y confiable.
                        </Typography>
                    </SafetyBox>

                    <Box display="flex" justifyContent="center">
                        {user ? (
                            allowedCountries.includes(user.country) ? (
                                <CheckoutButton
                                    girlId={girl.uid}
                                    price={girl.memberPrice}
                                    user={user.uid}
                                    country={user.country}
                                />
                            ) : (
                                <Typography variant="body1" color="error" align="center">
                                    Este servicio solo está disponible para usuarios de EE. UU., México o Argentina.
                                </Typography>
                            )
                        ) : (
                            <GradientButton
                                variant="contained"
                                sx={{ mt: 2, fontSize: 17 }}
                            >
                                Regístrate para pagar
                            </GradientButton>
                        )}
                    </Box>

                    <FeatureList>
                        <ListItem>
                            <ListItemIcon><CameraAltIcon sx={{ fontSize: 32, color: 'white' }}/></ListItemIcon>
                            <ListItemText primary="Fotos Privadas" primaryTypographyProps={{ fontSize: '1.4rem' }} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><SpatialAudioOffIcon sx={{ fontSize: 32, color: 'white' }}/></ListItemIcon>
                            <ListItemText primary={`Audios de ${girl ? girl.name : 'la chica'}`} primaryTypographyProps={{ fontSize: '1.4rem' }} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><MessageIcon sx={{ fontSize: 32, color: 'white' }}/></ListItemIcon>
                            <ListItemText primary="Mensajes ilimitados" primaryTypographyProps={{ fontSize: '1.4rem' }} />
                        </ListItem>
                    </FeatureList>

                    <GradientButton
                        onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                        startIcon={showPaymentInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        fullWidth
                        sx={{ mt: 2 }}
                        variant="contained"
                    >
                        {showPaymentInfo ? 'Ocultar' : 'Mostrar'} Seguridad de Pago
                    </GradientButton>

                    <Collapse in={showPaymentInfo}>
                        <Box mt={2} p={2} bgcolor="rgba(255,255,255,0.1)" borderRadius={2}>
                            <Typography variant="h6" gutterBottom>
                                Seguridad en el Pago
                            </Typography>
                            <Typography variant="body2" paragraph>
                                Tu seguridad es nuestra prioridad. Todos los pagos son procesados de manera segura por Stripe.
                            </Typography>
                            <Typography variant="body2" paragraph>
                                No almacenamos ningún dato de tarjetas de crédito en nuestros servidores. Stripe se encarga de todo, garantizando la seguridad y confidencialidad de tu información.
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<LockIcon />}
                                href="https://stripe.com"
                                target="_blank"
                                fullWidth
                                sx={{ color: 'white', borderColor: 'white' }}
                            >
                                Más información en stripe.com
                            </Button>
                        </Box>
                    </Collapse>
                </GlassCard>
            </Container>
        </Box>
    );
}

export default PrivateMember;