'use client';
import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import GirlsCarouselMUI from '@/app/components/dm/GirlsCarouselMUI';
import MessageList from '@/app/components/dm/MessageList';
import PostsClient from '@/app/posts/PostsClient';

// Loading skeleton for carousel
const CarouselSkeleton = () => (
  <div style={{ 
    height: '120px', 
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s infinite',
    borderRadius: '8px', 
    margin: '8px 0' 
  }} />
);

export default function DMListClient({ girls, user, initialPosts }) {
  return (
    <>
      <Suspense fallback={<CarouselSkeleton />}>
        <GirlsCarouselMUI
          girls={girls}
          isPremium={user?.userData?.premium || false}
        />
      </Suspense>

      <Suspense fallback={null}>
        <MessageList initialUser={user?.userData || null} />
      </Suspense>

      <Box sx={{ mt: 4 }}>
        <Suspense fallback={null}>
          <PostsClient initialPosts={initialPosts} />
        </Suspense>
      </Box>
    </>
  );
}