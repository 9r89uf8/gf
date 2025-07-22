'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import useStore from '../store/store';
import styles from './page.module.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const router = useRouter();
  const checkoutRef = useRef(null);
  const mountedRef = useRef(false);

  const {
    clientSecret,
    checkoutSessionId,
    paymentStatus,
    paymentError,
    resetPaymentCheckout,
  } = useStore();

  useEffect(() => {
    // Redirect to products if no session
    if (!clientSecret && !checkoutSessionId) {
      router.push('/products');
      return;
    }

    if (!clientSecret) return;

    const initCheckout = async () => {
      try {
        // Clean up any existing checkout instance first
        if (checkoutRef.current) {
          checkoutRef.current.destroy();
          checkoutRef.current = null;
        }

        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }

        // Only create checkout if component is still mounted
        if (!mountedRef.current) {
          const checkout = await stripe.initEmbeddedCheckout({
            clientSecret,
          });

          // Store the checkout instance in ref
          checkoutRef.current = checkout;

          // Only mount if we still have a valid checkout div
          const checkoutDiv = document.getElementById('checkout');
          if (checkoutDiv) {
            checkout.mount('#checkout');
          }
        }
      } catch (error) {
        console.error('Error mounting checkout:', error);
      }
    };

    // Set mounted flag
    mountedRef.current = false;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initCheckout();
    }, 100);

    // Cleanup
    return () => {
      mountedRef.current = true;
      clearTimeout(timeoutId);

      if (checkoutRef.current) {
        try {
          checkoutRef.current.destroy();
          checkoutRef.current = null;
        } catch (error) {
          console.error('Error destroying checkout:', error);
        }
      }
    };
  }, [clientSecret, router, checkoutSessionId]);

  const handleBackClick = () => {
    // Destroy checkout before navigating
    if (checkoutRef.current) {
      try {
        checkoutRef.current.destroy();
        checkoutRef.current = null;
      } catch (error) {
        console.error('Error destroying checkout on back:', error);
      }
    }
    resetPaymentCheckout();
    router.push('/products');
  };

  if (paymentError) {
    return (
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Error de Pago</h2>
            <p>{paymentError}</p>
            <button onClick={handleBackClick}>
              Volver a Productos
            </button>
          </div>
        </div>
    );
  }

  if (!clientSecret) {
    return (
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Preparando el pago...</p>
          </div>
        </div>
    );
  }

  return (
      <div className={styles.container}>
        <div className={styles.checkoutWrapper}>
          <div className={styles.header}>
            <h1>Completar tu Compra</h1>
            <button
                className={styles.backButton}
                onClick={handleBackClick}
            >
              ← Volver a Productos
            </button>
          </div>

          <div id="checkout" className={styles.checkoutContainer}>
            {/* Stripe Embedded Checkout will be mounted here */}
          </div>
        </div>
      </div>
  );
}