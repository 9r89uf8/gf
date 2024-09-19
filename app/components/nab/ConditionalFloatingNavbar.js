// app/components/nab/ConditionalFloatingNavbar.jsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import FloatingNavbar from "./FloatingNavbar";

const ConditionalFloatingNavbar = () => {
    const pathname = usePathname();
    const showFloatingNavbar = pathname !== '/chat';

    if (!showFloatingNavbar) {
        return null;
    }

    return <FloatingNavbar />;
};

export default ConditionalFloatingNavbar;