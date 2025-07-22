//dm/page.js
import React from 'react';
import { Box, Container } from '@mui/material';
import GirlsCarouselMUI from '@/app/components/dm/GirlsCarouselMUI';
import { cookies } from 'next/headers';
import MessageList from '@/app/components/dm/MessageList';
import { getAllGirlsCached } from '@/app/api/v2/services/girlsServerService';

// Get girls data using Redis cache
async function getGirlsData() {
    try {
        const girls = await getAllGirlsCached();
        return girls;
    } catch (error) {
        console.error('Error fetching girls:', error);
        return [];
    }
}

async function getUserData() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('tokenAIGF');
        
        // If no token, return early - no need to make API call
        if (!token) {
            return null;
        }
        
        // Direct server-side API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/verify`, {
            method: 'GET',
            headers: {
                // Forward the auth cookie
                Cookie: `tokenAIGF=${token.value}`
            }
        });

        if (!response.ok) {
            return null;
        }

        // Parse JSON only once and store the result
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

export default async function DMList() {
    // Fetch both girls and user data in parallel
    const [girls, user] = await Promise.all([
        getGirlsData(),
        getUserData()
    ]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <GirlsCarouselMUI
                    girls={girls}
                    isPremium={user?user.userData.premium:false}
                />

                <MessageList initialUser={user?.userData || null}/>
            </Container>
        </Box>
    );
};
