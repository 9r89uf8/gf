// app/components/nab/FloatingNavbar.js

import React from 'react';
import Link from 'next/link';
import MessageIcon from '@/app/components/nab/MessageIcon';
import ProfileIcon from '@/app/components/nab/ProfileIcon';
import UsersIcon from "@/app/components/nab/UsersIcon";

import './floating-navbar.css';

export default function FloatingNavbar({ pathname }) {
    const routes = [
        { name: 'HOME', path: '/chicas-ia', icon: <UsersIcon /> },
        { name: 'TOP', path: '/dm', icon: <MessageIcon /> },
        { name: 'USER', path: '/user', icon: <ProfileIcon /> }
    ];

    return (
        <nav className="floating-navbar">
            {routes.map((route, index) => {
                const isActive = pathname === route.path;

                return (
                    <Link
                        key={index}
                        href={route.path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        aria-label={route.name}
                    >
                        <span className="icon">{route.icon}</span>
                        <span className="label">{route.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}



