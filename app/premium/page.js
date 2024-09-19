'use client';
import React, { useState } from 'react';
import { useStore } from '@/app/store/store';
import CheckoutButton from "@/app/components/payment/CheckoutButton";
import {
    Container,
    Box,
    Button,
    Typography,
    Paper,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
} from '@mui/material';
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from '@mui/icons-material/Lock';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import MessageIcon from '@mui/icons-material/Message';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    marginTop: 15
}));

const PriceBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    background: 'rgba(255,255,255,0.1)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
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
        <Container maxWidth="sm">
            <StyledPaper elevation={4}>
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

                <Divider sx={{ my: 2 }} />

                <PriceBox>
                    {Array.isArray(priceInfo) ? (
                        priceInfo.map((price, index) => (
                            <Box key={index} textAlign="center" mb={index === 0 ? 2 : 0}>
                                <Typography variant="h4" color="text.primary" gutterBottom>
                                    ${price.price.toFixed(0)} {price.currency}
                                </Typography>
                                <Avatar src={price.flag} sx={{ mt: 1, width: 30, height: 20, mx: 'auto' }} variant="rounded" />
                            </Box>
                        ))
                    ) : (
                        <>
                            <Typography variant="h4" color="text.primary" gutterBottom>
                                ${priceInfo.price.toFixed(0)} {priceInfo.currency}
                            </Typography>
                            <Avatar src={priceInfo.flag} sx={{ mt: 1, width: 30, height: 20 }} variant="rounded" />
                        </>
                    )}
                    <Typography variant="h5" color="text.secondary" mt={2}>
                        Acceso por 15 días
                    </Typography>
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
                        <Button
                            style={{color: 'black', background: 'linear-gradient(135deg, #ffffff, #f5f3f4)'}}
                            variant="contained"
                            sx={{ mt: 2, fontSize: 17 }}
                        >
                            Regístrate para pagar
                        </Button>
                    )}
                </Box>

                <FeatureList>
                    <ListItem>
                        <ListItemIcon><CameraAltIcon sx={{ fontSize: 32 }}/></ListItemIcon>
                        <ListItemText primary="Fotos Privadas" primaryTypographyProps={{ fontSize: '1.4rem' }} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><SpatialAudioOffIcon sx={{ fontSize: 32 }}/></ListItemIcon>
                        <ListItemText primary={`Audios de ${girl ? girl.name : 'la chica'}`} primaryTypographyProps={{ fontSize: '1.4rem' }} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><MessageIcon sx={{ fontSize: 32 }}/></ListItemIcon>
                        <ListItemText primary="Mensajes ilimitados" primaryTypographyProps={{ fontSize: '1.4rem' }} />
                    </ListItem>
                </FeatureList>

                <Button
                    onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                    startIcon={showPaymentInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    fullWidth
                    sx={{ mt: 2 }}
                    variant="contained"
                    style={{color: 'white', background: 'linear-gradient(135deg, #161a1d, #0b090a)'}}
                >
                    {showPaymentInfo ? 'Ocultar' : 'Mostrar'} Seguridad de Pago
                </Button>

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
                        >
                            Más información en stripe.com
                        </Button>
                    </Box>
                </Collapse>
            </StyledPaper>
        </Container>
    );
}

export default PrivateMember;