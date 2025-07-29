// app/components/analytics/GoogleAnalytics.jsx
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_TRACKING_ID = 'G-ENZST04463';

const GoogleAnalytics = () => {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Use requestIdleCallback if available, with fallback
        if ('requestIdleCallback' in window) {
            const idleCallbackId = window.requestIdleCallback(
                () => setShouldLoad(true),
                { timeout: 3000 } // Load after 3 seconds max
            );
            
            return () => {
                if ('cancelIdleCallback' in window) {
                    window.cancelIdleCallback(idleCallbackId);
                }
            };
        } else {
            // Fallback for browsers without requestIdleCallback
            const timeoutId = setTimeout(() => setShouldLoad(true), 2000);
            return () => clearTimeout(timeoutId);
        }
    }, []);

    if (!shouldLoad) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                strategy="lazyOnload"
            />
            <Script
                id="google-analytics-init"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              transport_type: 'beacon'
            });
          `
                }}
            />
        </>
    );
};

export default GoogleAnalytics;