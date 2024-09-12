'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import {getGirl} from "@/app/services/girlService";
import CheckoutButton from "@/app/components/payment/CheckoutButton";
import { Container, Paper, Typography, InputBase, Button, styled, alpha, FormControlLabel, Switch, IconButton, Avatar, Box } from '@mui/material';

import MessageIcon from '@mui/icons-material/Message';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';

const ItemFooter = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: '#ffffff',
    background: 'linear-gradient(45deg, #343a40, #001219)', // semi-transparent white
    backdropFilter: 'blur(10px)', // apply blur
    borderRadius: 10, // rounded corners
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
}));



const Footer = () => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);


    useEffect(() => {
        getGirl()
    }, []);

    const calculatePrice = () => {
        let price;
        let currency;
        let currencyName;
        let flag;

        switch (user.country) {
            case 'MX':
                price = girl.memberPrice * 17;
                currency = 'MXN'; // Mexican Peso
                currencyName = 'pesos'
                flag = 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(5).png'
                break;
            case 'AR':
                price = girl.memberPrice * 800;
                currency = 'ARS'; // Argentine Peso
                currencyName = 'pesos'
                flag = 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(6).png'
                break;
            default: // Assuming default is 'US'
                price = girl.memberPrice;
                currency = 'USD'; // US Dollar
                currencyName = 'dólares'
                flag = 'https://chicagocarhelp.s3.us-east-2.amazonaws.com/EMELY+(7).png'
                break;
        }

        return { price, currency, currencyName, flag };
    };

    const priceInfo = calculatePrice();

    const handlePay = () => {
        router.push('/user');
    };

    return (
        <Container maxWidth="sm">
            <ItemFooter elevation={4} style={{marginBottom: -80}}>
                <Box style={{
                    background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
                    padding: '10px',
                    borderRadius: '10px',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 10
                }}>
                    <Typography variant="h5" gutterBottom style={{ color: "#000000" }}>
                        Miembro Privado
                    </Typography>

                    <Typography variant="h5" gutterBottom style={{ color: "#000000" }}>
                        $<span style={{fontSize: 29, padding: 2}}>{priceInfo.price.toFixed(0)}</span> <span>{priceInfo.currencyName}</span>
                    </Typography>

                    <Avatar variant="square" alt="Remy Sharp" src={priceInfo.flag} />

                </Box>

                <div style={{margin: '20px 5px 2px 5px'}}>
                    <CheckoutButton girlId={girl.uid} price={girl.memberPrice} user={user.uid} country={user.country}/>
                </div>


                <Typography variant="h5" gutterBottom style={{color: "#fcfcfc", margin: 15}}>
                    Acceso por 30 días
                </Typography>


                <Box style={{ marginLeft: 15 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <CameraAltIcon /> {/* Replace with actual icon */}
                        <Typography variant="h6" style={{ marginLeft: 10 }}>
                            Fotos Privadas
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                        <SpatialAudioOffIcon /> {/* Replace with actual icon */}
                        <Typography variant="h6" style={{ marginLeft: 10 }}>
                            Audios de {girl.name}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                        <MessageIcon /> {/* Replace with actual icon */}
                        <Typography variant="h6" style={{ marginLeft: 10 }}>
                            Mensajes ilimitados
                        </Typography>
                    </Box>
                </Box>
            </ItemFooter>
        </Container>
    );
};

export default Footer;