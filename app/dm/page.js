//dm/page.js
import React from 'react';
import { Box, Container } from '@mui/material';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { getAllGirlsCached } from '@/app/api/v2/services/girlsServerService';
import { getPostsForSSR } from '@/app/api/v2/services/postsServerService';

// Dynamic imports with loading states for better INP
const GirlsCarouselMUI = dynamic(
  () => import('@/app/components/dm/GirlsCarouselMUI'),
  { 
    loading: () => <div style={{ height: '120px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', margin: '8px 0' }} />,
    ssr: false
  }
);

const MessageList = dynamic(
  () => import('@/app/components/dm/MessageList'),
  { 
    loading: () => null,
    ssr: false
  }
);

const PostsClient = dynamic(
  () => import('@/app/posts/PostsClient'),
  { 
    loading: () => null,
    ssr: false
  }
);


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
    // Only fetch critical data server-side, defer non-critical data
    const [girls, user] = await Promise.all([
        getGirlsData(),
        getUserData()
    ]);
    
    // Fetch posts separately to not block initial render
    const initialPosts = await getPostsForSSR(15, 0).catch(() => []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                py: 1,
            }}
        >
            <Container maxWidth="lg">
                <GirlsCarouselMUI
                    girls={girls}
                    isPremium={user?.userData?.premium || false}
                />

                <MessageList initialUser={user?.userData || null}/>

                <Box sx={{ mt: 4 }}>
                    <PostsClient initialPosts={initialPosts} />
                </Box>
            </Container>
        </Box>
    );
};
