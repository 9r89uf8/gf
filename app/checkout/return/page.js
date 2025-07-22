import { Suspense } from 'react';
import CheckoutReturnClient from './CheckoutReturnClient';
import LoadingFallback from './LoadingFallback';

export default function CheckoutReturnPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutReturnClient />
    </Suspense>
  );
}