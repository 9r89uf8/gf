// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './styles/globals.css';



const FloatingNavbar = dynamic(() => import('@/app/components/nab/FloatingNavbar'), { ssr: true });

const Notifications = dynamic(() => import('@/app/components/notifications/Notifications'), { ssr: false });
const GoogleAnalytics = dynamic(() => import('@/app/components/google/GoogleAnalytics'), { ssr: false });


const Layout = ({ children }) => {

    return (
        <html lang="es">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="preconnect" href="https://imagedelivery.net"/>
        </head>
        <body>
        <Navbar/>
        {/* Delay non-critical components */}
        <React.Suspense fallback={null}>
            <Notifications/>
        </React.Suspense>
        <main style={{ paddingBottom: 'var(--floating-navbar-height, 0px)' }}>{children}</main>
        <FloatingNavbar/>
        {/* Load analytics after interaction */}
        <React.Suspense fallback={null}>
            <GoogleAnalytics />
        </React.Suspense>

        {/* Defer Turnstile script */}
        <Script
            src={"https://challenges.cloudflare.com/turnstile/v0/api.js"}
            strategy="afterInteractive"
            defer
        />
        </body>
        </html>
    );
};

export default Layout;
