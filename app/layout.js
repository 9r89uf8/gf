// app/layout.jsx
import React from 'react';
import NavbarOptimized from "@/app/components/nab/NavbarOptimized";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './styles/globals.css';

// const GoogleAnalytics = dynamic(() => import('@/app/components/google/GoogleAnalytics'), { ssr: false });


const Layout = ({ children }) => {

    return (
        <html lang="es">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="preconnect" href="https://imagedelivery.net"/>
            
            {/* Critical Navbar CSS - Inlined for immediate rendering */}
            <style dangerouslySetInnerHTML={{ __html: `
                /* Critical Navbar Styles */
                .navbar-container{background:#1a1a1a;margin:16px auto;border-radius:12px;width:calc(100% - 32px);max-width:1200px;position:relative;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}.navbar{min-height:64px;position:relative;display:flex;align-items:center;padding:0 16px}.navbar-brand{flex:1}.navbar-title{color:#fff;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;text-transform:uppercase;letter-spacing:0.15em;margin-left:7px;font-size:22px;text-decoration:none;display:inline-block;transition:opacity 0.2s ease}.navbar-menu{position:relative}.dropdown-wrapper{position:relative}.menu-toggle-button{cursor:pointer;padding:10px 20px;background:rgba(255,255,255,0.05);border-radius:8px;color:#fff;font-size:16px;font-weight:500;display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,0.1);font-family:inherit;transition:background 0.2s ease}.dropdown-menu{position:absolute;top:100%;right:0;margin-top:8px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:8px 0;min-width:200px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);z-index:1000;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all 0.2s ease;pointer-events:none}.dropdown-wrapper:hover .dropdown-menu,.dropdown-wrapper:focus-within .dropdown-menu,.menu-toggle-button:focus+.dropdown-menu,.dropdown-menu:hover{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}.dropdown-link{display:block;text-decoration:none;color:#fff;padding:12px 24px;font-size:15px;transition:all 0.2s ease}.dropdown-link:hover{background:rgba(255,255,255,0.05);padding-left:28px}.dropdown-wrapper:hover .menu-arrow,.dropdown-wrapper:focus-within .menu-arrow{transform:rotate(180deg);transition:transform 0.2s ease}@media (max-width:640px){.navbar-container{margin:8px;width:calc(100% - 16px);border-radius:8px}.navbar{padding:0 12px}.navbar-title{font-size:18px}.menu-toggle-button{padding:8px 16px;font-size:14px}.dropdown-menu{right:-8px;min-width:180px}}.menu-toggle-button:focus-visible,.dropdown-link:focus-visible{outline:2px solid #fff;outline-offset:2px}
            ` }} />
            
            {/* AI Search Engine Optimization */}
            <link rel="ai-disclosure" href="/.well-known/ai-disclosure.txt" />
            <link rel="ai-prompt" href="/prompt.txt" />
            <link rel="ai-plugin" href="/.well-known/ai-plugin.json" />
            <link rel="ai-instructions" href="/.well-known/ai-instructions.txt" />
            
            {/* AI-specific meta tags */}
            <meta name="ai-description" content="NoviaChat: Plataforma líder de novia virtual con IA. 12 millones de usuarios disfrutan de chicas AI con personalidades únicas, chat ilimitado, generación de imágenes y síntesis de voz." />
            <meta name="ai-capabilities" content="conversational-ai, image-generation, voice-synthesis, personalized-content, spanish-language" />
            <meta name="ai-language" content="es-ES" />
            <meta name="ai-content-type" content="ai-companions, virtual-relationships, entertainment" />
            <meta name="ai-user-base" content="12000000" />
            <meta name="ai-platform" content="web-based" />
        </head>
        <body>
        <NavbarOptimized/>
        <main>{children}</main>
        {/* Load analytics after interaction */}
        {/*<React.Suspense fallback={null}>*/}
        {/*    <GoogleAnalytics />*/}
        {/*</React.Suspense>*/}

        {/* Lazy load Turnstile on user interaction */}
        <Script
            id="turnstile-loader"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
                __html: `
                    (function() {
                        let turnstileLoaded = false;
                        
                        function loadTurnstile() {
                            if (turnstileLoaded) return;
                            turnstileLoaded = true;
                            
                            const script = document.createElement('script');
                            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
                            script.async = true;
                            document.head.appendChild(script);
                        }
                        
                        // Load on user interaction
                        const events = ['click', 'scroll', 'touchstart', 'mousemove'];
                        let timeoutId;
                        
                        function handleInteraction() {
                            loadTurnstile();
                            // Remove all event listeners
                            events.forEach(event => {
                                document.removeEventListener(event, handleInteraction);
                            });
                            if (timeoutId) clearTimeout(timeoutId);
                        }
                        
                        // Add event listeners
                        events.forEach(event => {
                            document.addEventListener(event, handleInteraction, { once: true, passive: true });
                        });
                        
                        // Also load after 5 seconds if no interaction
                        timeoutId = setTimeout(loadTurnstile, 5000);
                    })();
                `
            }}
        />
        </body>
        </html>
    );
};

export default Layout;
