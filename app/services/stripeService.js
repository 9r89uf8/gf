import getStripe from "@/app/utils/getStripe";
import { useStore } from '../store/store'; // Ensure you import the correct store

export const createCheckoutSession = async (formData) => {
    const addNotification = useStore.getState().addNotification;
    const setLoading = useStore.getState().setLoading;
    const setError = useStore.getState().setError;

    setLoading(true);
    setError(null);

    try {
        const response = await fetch('/api/payment/checkout_sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (!response.ok) {
            setLoading(false);
            setError(data.error);
            addNotification({
                id: Date.now(),
                type: 'error',
                message: data.error,
            });
            return;
        }

        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
            sessionId: data.id,
        });

        if (error) {
            setLoading(false);
            setError(error.message);
            addNotification({
                id: Date.now(),
                type: 'error',
                message: error.message,
            });
            return;
        }

        setLoading(false);
        addNotification({
            id: Date.now(),
            type: 'success',
            message: 'Redirecting to checkout...',
        });
    } catch (error) {
        setLoading(false);
        setError(error.message);
        addNotification({
            id: Date.now(),
            type: 'error',
            message: error.message,
        });
    }
};

export const verifySession = async (sessionId) => {
    const addNotification = useStore.getState().addNotification;
    const setLoading = useStore.getState().setLoading;
    const setError = useStore.getState().setError;
    const setStatus = useStore.getState().setStatus;

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
        const response = await fetch('/api/payment/verify-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await response.json();

        if (data.success) {
            setStatus('success');
            addNotification({
                id: Date.now(),
                type: 'success',
                message: 'Pago Exitoso',
            });
        } else {
            setStatus('cancel');
            addNotification({
                id: Date.now(),
                type: 'error',
                message: 'Pago Cancelado',
            });
        }
    } catch (error) {
        setStatus('cancel');
        setError(error.message);
        addNotification({
            id: Date.now(),
            type: 'error',
            message: 'Error de verificación de pago',
        });
    } finally {
        setLoading(false);
    }
};