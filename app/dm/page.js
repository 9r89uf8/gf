//dm/page.js
import React from 'react';
import { Box, Container } from '@mui/material';
import GirlsCarousel from '@/app/components/dm/GirlsCarousel';
import { cookies } from 'next/headers';
import MessageList from '@/app/components/dm/MessageList';

// Generate static paths at build time
export async function generateStaticParams() {
    // Fetch all girl IDs from your API or database
    const girls = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/girls`)
        .then(res => res.json())
        .catch(() => []);

    // Return an array of objects with the id parameter
    return girls
}

async function getUserData() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('tokenAIGF');
        // Direct server-side API call with POST method and id in the body
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
            method: 'GET',
            headers: {
                // Forward the auth cookie
                Cookie: token ? `tokenAIGF=${token.value}` : ''
            },
            next: {
                revalidate: 3600 // Revalidate every hour
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch girl data');
        }

        // Parse JSON only once and store the result
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching girl data:", error);
        return null;
    }
}

export default async function DMList() {

    const girls = await generateStaticParams()
    const user = await getUserData()


    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="lg">
                <GirlsCarousel
                    girls={girls}
                    isPremium={user.userData.premium}
                />

                <MessageList/>
            </Container>
        </Box>
    );
};
