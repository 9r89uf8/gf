// components/CheckoutButton.jsx
'use client';

import React, {useEffect} from 'react';
import { Button } from '@mui/material';
import {createCheckoutSession} from "@/app/services/stripeService";
import { useStore } from '@/app/store/store';

const CheckoutButton = ({user, country, price, girlId}) => {
    const loading = useStore((state) => state.loading);
    const setLoading = useStore((state) => state.setLoading);
    const paymentData = { userId: user, country: country, price: price, girlId: girlId};

    const handleCheckout = () => {
        createCheckoutSession(paymentData); // example amount
    };

    useEffect(() => {
        setLoading(false)
    }, []);

    return (
        <Button
            style={{color: 'black', background: 'linear-gradient(135deg, #ffffff, #f5f3f4)'}}
            variant="contained"
            onClick={handleCheckout}
            disabled={loading}
            sx={{ fontSize: 22 }}
        >
            {loading ? 'Processing...' : 'Pagar'}
        </Button>
    );
};

export default CheckoutButton;

