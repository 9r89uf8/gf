'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/page.module.css';
import UserProfileClient from "@/app/components/user/UserProfileClient";
import LoginPrompt from "@/app/components/user/LoginPrompt";
import UserProfileSkeleton from "@/app/components/user/UserProfileSkeleton";

// Client-side auth verification function
async function getUserData() {
    try {
        const response = await fetch(`/api/v2/auth/verify`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Auth verification error:', error);
        return null;
    }
}

// This is now a client component
function UserProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const userData = await getUserData();
            setUser(userData);
            setLoading(false);
            setAuthChecked(true);
        };

        checkAuth();
    }, []);

    // Show skeleton immediately while checking auth
    if (loading || !authChecked) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <UserProfileSkeleton />
                </div>
            </div>
        );
    }

    // Check if user exists and is authenticated
    if (!user || user.isAuthenticated === false) {
        return <LoginPrompt />;
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <UserProfileClient initialUserData={user.userData} />
            </div>
        </div>
    );
}

export default UserProfilePage;
