// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './styles/globals.css';
// Import critical CSS
import './styles/critical.css'



const ConditionalFloatingNavbar = dynamic(() => import('@/app/components/nab/ConditionalFloatingNavbar'), { ssr: false });

const Notifications = dynamic(() => import('@/app/components/notifications/Notifications'), { ssr: false });


const GA_TRACKING_ID = 'G-ENZST04463';

const Layout = ({ children }) => {
    return (
        <html lang="es">
        <head>

            <Script async src={"https://challenges.cloudflare.com/turnstile/v0/api.js"} strategy="lazyOnload" />


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

        </head>
        <body>
        <Navbar />
        <Notifications />
        <main style={{ paddingBottom: 'var(--floating-navbar-height, 0px)' }}>{children}</main>
        <ConditionalFloatingNavbar />
        </body>
        </html>
    );
};

export default Layout;
