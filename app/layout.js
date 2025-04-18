// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './styles/globals.css';
// Import critical CSS
import './styles/critical.css'



const FloatingNavbar = dynamic(() => import('@/app/components/nab/FloatingNavbar'), { ssr: false });

const Notifications = dynamic(() => import('@/app/components/notifications/Notifications'), { ssr: false });
const GoogleAnalytics = dynamic(() => import('@/app/components/google/GoogleAnalytics'), { ssr: false });


const Layout = ({ children }) => {

    return (
        <html lang="es">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="preconnect" href="https://imagedelivery.net"/>
            <Script src={"https://challenges.cloudflare.com/turnstile/v0/api.js"} strategy="lazyOnload"/>

        </head>
        <body>
        <Navbar/>
        <Notifications/>
        <main style={{ paddingBottom: 'var(--floating-navbar-height, 0px)' }}>{children}</main>
        <FloatingNavbar/>
        <GoogleAnalytics />
        </body>
        </html>
    );
};

export default Layout;
