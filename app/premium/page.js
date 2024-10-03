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
    Grid,
} from '@mui/material';
import { styled, alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from '@mui/icons-material/Lock';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import MessageIcon from '@mui/icons-material/Message';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useRouter} from "next/navigation";
import VerifiedIcon from "@mui/icons-material/Verified";

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


const PriceTypography = styled(Typography)(({ theme }) => ({
    color: '#212529',
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
    background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'black',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const PriceCard = styled(Card)(({ theme }) => ({
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    },
}));

const PrivateMember = () => {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const allowedCountries = ['US', 'MX', 'AR'];


    const handleLoginRedirect = () => {
        router.push('/register'); // Adjust the path to your login or register page
    };

    const pricingOptions = [
        {
            country: 'US',
            price: girl ? girl.memberPrice : 4,
            currency: 'USD',
            name: 'dólares',
            flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(7).png',
            gradient: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)'
        },
        {
            country: 'MX',
            price: girl ? girl.memberPrice * 17 : 70,
            currency: 'MXN',
            name: 'pesos',
            flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(5).png',
            gradient: 'linear-gradient(45deg, #7ae582 30%, #25a18e 90%)'
        },
        {
            country: 'AR',
            price: girl ? girl.memberPrice * 800 : 3200,
            currency: 'ARS',
            name: 'pesos',
            flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(6).png',
            gradient: 'linear-gradient(45deg, #00afb9 30%, #0081a7 90%)'
        },
    ];

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
                            sx={{ width: 160, height: 160, mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
                            {girl ? girl.username : 'Username'}
                            <VerifiedIcon
                                sx={{ ml: 1, verticalAlign: 'middle', color: '#4FC3F7' }}
                            />
                        </Typography>
                        {/*<Typography variant="h6" color="text.primary">*/}
                        {/*    Miembro Privado*/}
                        {/*</Typography>*/}
                    </CenteredBox>

                    <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 4 }} />


                    <Typography variant="h4" align="center" gutterBottom>
                        Elige Tu País
                    </Typography>

                    <Grid container spacing={3} justifyContent="center">
                        {pricingOptions.map((option) => (
                            <Grid item xs={12} sm={4} key={option.country}>
                                <PriceCard
                                    onClick={() => setSelectedCountry(option.country)}
                                    sx={{
                                        background: selectedCountry === option.country
                                            ? 'linear-gradient(45deg, #f48c06 30%, #dc2f02 90%)'
                                            : option.gradient,
                                    }}
                                >
                                    <Avatar src={option.flag} sx={{ mb: 2, width: 56, height: 56 }} variant="rounded" />
                                    <Typography variant="h3" fontWeight="bold">
                                        ${option.price.toFixed(0)}
                                    </Typography>
                                    <Typography variant="h6">
                                        {option.name}
                                    </Typography>


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
                                                onClick={handleLoginRedirect}
                                            >
                                                Crear Cuenta
                                            </GradientButton>
                                        )}
                                    </Box>

                                    <PriceTypography variant="h5" mt={2} fontWeight="bold">
                                        Acceso por 15 días
                                    </PriceTypography>
                                    <Typography variant="h6" mt={2}>
                                        para personas de
                                    </Typography>
                                    <Typography variant="h5" mt={2} style={{marginTop: -3, color: 'white'}}>
                                        {option.country === 'US' ? 'Estados Unidos' : option.country === 'MX' ? 'México' : 'Argentina'}
                                    </Typography>
                                </PriceCard>
                            </Grid>
                        ))}
                    </Grid>



                    <SafetyBox>
                        <Typography variant="h5" fontWeight="bold">
                            Pago Seguro Garantizado
                        </Typography>
                        <Typography variant="h6">
                            Tu transacción es 100% segura. Stripe.com, líder en pagos en línea, procesa tu pago de forma segura y confiable.
                        </Typography>
                    </SafetyBox>

                    {/*<Box display="flex" justifyContent="center">*/}
                    {/*    {user ? (*/}
                    {/*        allowedCountries.includes(user.country) ? (*/}
                    {/*            <CheckoutButton*/}
                    {/*                girlId={girl.uid}*/}
                    {/*                price={girl.memberPrice}*/}
                    {/*                user={user.uid}*/}
                    {/*                country={user.country}*/}
                    {/*            />*/}
                    {/*        ) : (*/}
                    {/*            <Typography variant="body1" color="error" align="center">*/}
                    {/*                Este servicio solo está disponible para usuarios de EE. UU., México o Argentina.*/}
                    {/*            </Typography>*/}
                    {/*        )*/}
                    {/*    ) : (*/}
                    {/*        <GradientButton*/}
                    {/*            variant="contained"*/}
                    {/*            sx={{ mt: 2, fontSize: 17 }}*/}
                    {/*            onClick={handleLoginRedirect}*/}
                    {/*        >*/}
                    {/*            Crear Cuenta*/}
                    {/*        </GradientButton>*/}
                    {/*    )}*/}
                    {/*</Box>*/}

                    <FeatureList>
                        <ListItem>
                            <ListItemIcon><CameraAltIcon sx={{ fontSize: 40, color: 'white' }}/></ListItemIcon>
                            <ListItemText primary="Fotos Privadas" primaryTypographyProps={{ fontSize: '1.4rem' }} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><SpatialAudioOffIcon sx={{ fontSize: 40, color: 'white' }}/></ListItemIcon>
                            <ListItemText primary={`Audios de ${girl ? girl.name : 'la chica'}`} primaryTypographyProps={{ fontSize: '1.4rem' }} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><MessageIcon sx={{ fontSize: 40, color: 'white' }}/></ListItemIcon>
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
                            <Typography variant="h6" paragraph>
                                Tu seguridad es nuestra prioridad. Todos los pagos son procesados de manera segura por Stripe.
                            </Typography>
                            <Typography variant="h6" paragraph>
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