// components/CheckoutButton.jsx
'use client';

import React, {useEffect} from 'react';
import { Button } from '@mui/material';
import {createCheckoutSession} from "@/app/services/stripeService";
import { useStore } from '@/app/store/store';
import {styled} from "@mui/material/styles";
import { track } from '@vercel/analytics';
const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #343a40 30%, #212529 90%)',
    border: 0,
    borderRadius: 25,
    marginTop: 15,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));


const CheckoutButton = () => {
    const loading = useStore((state) => state.loading);
    const setLoading = useStore((state) => state.setLoading);

    const handleCheckout = () => {
        track('Purchase');
        createCheckoutSession(); // example amount
    };

    useEffect(() => {
        setLoading(false)
    }, []);

    return (
        <GradientButton
            variant="contained"
            onClick={handleCheckout}
            disabled={loading}
            sx={{ fontSize: 26 }}
        >
            {loading ? 'Espera...' : 'Pagar'}
        </GradientButton>
    );
};

export default CheckoutButton;

