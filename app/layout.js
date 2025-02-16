// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import Script from 'next/script';
import ConditionalFloatingNavbar from "@/app/components/nab/ConditionalFloatingNavbar";
import ServiceWorkerRegister from "@/app/components/sw/ServiceWorkerRegister";
import Notifications from "@/app/components/notifications/Notifications";
import './styles/globals.css';

const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "noviachat",
    "url": "https://www.noviachat.com",
    "description": "novia virtual, novia IA.",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.noviachat.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

const GA_TRACKING_ID = 'G-ENZST04463'; // Replace with your actual GA tracking ID
const Layout = ({ children }) => {
    return (
        <html lang="es">
        <head>
            <title>Novia Virtual - Noviachat | Texto, Foto y Voz. Tu Compañera Virtual Siempre Contigo</title>
            <meta name="description"
                  content="Conecta y comparte momentos inolvidables con NoviaChat, la aplicación 1 en latinoamérica para chatear. Disponible en cualquier momento y lugar. Novia virtual impulsada por IA"/>
            <meta name="keywords"
                  content="NoviaChat, compañera virtual, novia virtual, chat IA, inteligencia artificial, compañía virtual"/>
            <link rel="canonical" href="https://www.noviachat.com/"/>


            <meta property="og:title" content="NoviaChat - Tu Compañera Virtual Siempre Contigo"/>
            <meta property="og:description"
                  content="Conecta y comparte momentos inolvidables con NoviaChat, tu compañera virtual impulsada por IA. Disponible en cualquier momento y lugar."/>
            <meta property="og:url" content="https://www.noviachat.com/"/>
            <meta property="og:type" content="website"/>
            <meta property="og:image" content="https://www.noviachat.com/imagen-og.jpg"/>


            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="NoviaChat - Tu Compañera Virtual Siempre Contigo"/>
            <meta name="twitter:description"
                  content="Conecta y comparte momentos inolvidables con NoviaChat, tu compañera virtual impulsada por IA. Disponible en cualquier momento y lugar."/>
            <meta name="twitter:image" content="https://www.noviachat.com/imagen-twitter.jpg"/>


            <link rel="icon" href="/favicon.ico"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="robots" content="index, follow"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            {/* Google Analytics Scripts loaded lazily */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
          `}
            </Script>
        </head>
        <body>
        {/*<ServiceWorkerRegister />*/}
        <Navbar/>
        <Notifications />
        <main style={{paddingBottom: 'var(--floating-navbar-height, 0px)'}}>{children}</main>
        <ConditionalFloatingNavbar/>
        </body>
        </html>
    );
};

export default Layout;
