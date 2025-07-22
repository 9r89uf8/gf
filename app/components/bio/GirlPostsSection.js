'use client';

import React, { lazy, Suspense } from 'react';
import { useStore } from '@/app/store/store';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

// Lazy loaded components
const GirlPostsComp = lazy(() => import("@/app/components/posts/GirlPostsComp"));

// Using ModernCard instead of GlassCard for consistency

// Loading fallback for lazy components
const LoadingSkeleton = () => (
    <Grid container spacing={3}>
        {[...Array(9)].map((_, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={200} 
                    sx={{ bgcolor: 'rgba(0, 0, 0, 0.11)', borderRadius: 2 }}
                />
            </Grid>
        ))}
    </Grid>
);

export default function GirlPostsSection({ girl }) {
    const user = useStore((state) => state.user);
    return (
        <>
            <Suspense fallback={<LoadingSkeleton />}>
                <Grid container spacing={3}>
                    {girl.posts.map((post) => (
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                            <GirlPostsComp
                                girl={post.girlId}
                                user={user}
                                post={post}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Suspense>
        </>
    );
}