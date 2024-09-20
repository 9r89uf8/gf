'use client';
import React from 'react';
import { useStore } from '@/app/store/store';
import { getGirl } from "@/app/services/girlService";
import CheckoutButton from "@/app/components/payment/CheckoutButton";
import { Container, Paper, Typography, Avatar, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import HeadsetIcon from '@mui/icons-material/Headset';
import ChatIcon from '@mui/icons-material/Chat';

const StyledFooter = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    background: 'linear-gradient(45deg, #1a237e, #283593)',
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[10],
}));

const PriceBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.common.white, 0.1),
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const BenefitsList = styled(List)(({ theme }) => ({
    '& .MuiListItem-root': {
        paddingLeft: 0,
        paddingRight: 0,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 40,
        color: theme.palette.common.white,
    },
}));

const Footer = () => {
    const { user, girl } = useStore();

    React.useEffect(() => {
        getGirl();
    }, []);

    const calculatePrice = () => {
        const prices = {
            MX: { value: girl.memberPrice * 17, currency: 'MXN', name: 'pesos', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(5).png' },
            AR: { value: girl.memberPrice * 800, currency: 'ARS', name: 'pesos', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(6).png' },
            US: { value: girl.memberPrice, currency: 'USD', name: 'dólares', flag: 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(7).png' },
        };
        return prices[user.country] || prices.US;
    };

    const priceInfo = calculatePrice();

    return (
        <Container maxWidth="sm">
            <StyledFooter elevation={4}>
                <Typography variant="h4" gutterBottom align="center">
                    Acceso Premium Exclusivo
                </Typography>

                <PriceBox>
                    <Box>
                        <Typography variant="h5">
                            {priceInfo.value.toFixed(0)} {priceInfo.currency}
                        </Typography>
                        <Typography variant="subtitle1">
                            por 15 días de acceso
                        </Typography>
                    </Box>
                    <Avatar variant="square" src={priceInfo.flag} alt={`Flag of ${user.country}`} />
                </PriceBox>

                <BenefitsList>
                    <ListItem>
                        <ListItemIcon>
                            <PhotoLibraryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Fotos Privadas Exclusivas" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <HeadsetIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Audios Personalizados de ${girl.name}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ChatIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mensajes Ilimitados" />
                    </ListItem>
                </BenefitsList>

                <Box mt={3}>
                    <CheckoutButton
                        girlId={girl.uid}
                        price={girl.memberPrice}
                        user={user.uid}
                        country={user.country}
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<LockIcon />}
                    >
                        Obtener Acceso Premium
                    </CheckoutButton>
                </Box>
            </StyledFooter>
        </Container>
    );
};

export default Footer;