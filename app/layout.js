// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './styles/globals.css';



const FloatingNavbar = dynamic(() => import('@/app/components/nab/FloatingNavbar'), { ssr: false });

const Notifications = dynamic(() => import('@/app/components/notifications/Notifications'), { ssr: false });
const GoogleAnalytics = dynamic(() => import('@/app/components/google/GoogleAnalytics'), { ssr: false });


const Layout = ({ children }) => {

    return (
        <html lang="es">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="preconnect" href="https://imagedelivery.net"/>
            {/* Add critical CSS inline */}
            <style dangerouslySetInnerHTML={{ __html: `
                .welcome_glassCard {
                    text-align: center;
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.20);
                    padding: 16px;
                    margin-bottom: 32px;
                    user-select: none;
                }
                
                .welcome_welcomeContainer {
                    margin-bottom: 32px;
                    text-align: center;
                }
                
                .welcome_welcomeTitle {
                    font-size: 34px;
                    font-weight: bold;
                    letter-spacing: 4px;
                    margin-bottom: 16px;
                }
                
                .welcome_welcomeDescription {
                    font-size: 18px;
                    margin-bottom: 24px;
                    line-height: 1.4;
                    letter-spacing: 1px;
                }
                
                .welcome_startChatButton {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background-color: #040404;
                    color: #ffffff;
                    border-radius: 30px;
                    font-weight: 500;
                    font-size: 20px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border: none;
                    cursor: pointer;
                    margin-bottom: 2px;
                }
                
                /* Add your Creators component critical styles here */
                .creatorsSection {
                    padding: 1rem;
                    margin-top: -35px;
                }
                
                .headerText {
                    text-align: center;
                    margin-bottom: 1rem;
                }
                
                .headerText h2 {
                    font-size: 2rem;
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                }
                
                .headerText p {
                    font-size: 1.2rem;
                    color: #ececec;
                }
            `}} />
            <Script src={"https://challenges.cloudflare.com/turnstile/v0/api.js"} strategy="lazyOnload"/>
            <link
                rel="preload"
                href="https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/3cc53e5e-99ae-434f-ff28-a23a589b2400/w=200,fit=scale-down"
                as="image"
            />
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
