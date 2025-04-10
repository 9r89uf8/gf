// app/components/nab/ServerConditionalFloatingNavbar.js
import React from 'react';
import FloatingNavbar from './FloatingNavbar';
import { headers } from 'next/headers';

export default function ConditionalFloatingNavbar() {
    // Get the full URL from the request headers
    const headersList = headers();
    const referer = headersList.get('referer') || '';

    // Extract the pathname from the URL
    let pathname = '/';
    try {
        if (referer) {
            // If referer exists, extract pathname from it
            const url = new URL(referer);
            pathname = url.pathname;
        } else if (headersList.get('x-forwarded-uri')) {
            // Some hosting platforms provide this
            pathname = headersList.get('x-forwarded-uri');
        }
    } catch (e) {
        console.error('Error parsing pathname:', e);
    }


    // Hide on /chat and /clips routes
    const hide = pathname.startsWith('/chat') || pathname === '/clips';

    if (hide) return null;

    return <FloatingNavbar pathname={pathname} />;
}

