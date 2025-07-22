// app/profile/page.jsx (Server Component)
import styles from '@/app/styles/page.module.css';
import UserProfileClient from "@/app/components/user/UserProfileClient";
import LoginPrompt from "@/app/components/user/LoginPrompt";
import {cookies} from "next/headers";

async function getUserData() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('tokenAIGF');


        // If no token, return early - no need to make API call
        if (!token) {
            return null;
        }

        // Direct server-side API call with POST method and id in the body
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/verify`, {
            method: 'GET',
            headers: {
                // Forward the auth cookie
                Cookie: token ? `tokenAIGF=${token.value}` : ''
            }
        });

        // Parse JSON only once and store the result
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

// This is a server component - no 'use client' directive
async function UserProfilePage() {
    const user = await getUserData()

    // Check if user exists before accessing its properties
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
