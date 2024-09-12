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
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            disabled={loading}
        >
            {loading ? 'Processing...' : 'Pagar'}
        </Button>
    );
};

export default CheckoutButton;

