'use client';

import React, { lazy, Suspense } from 'react';
import { useStore } from '@/app/store/store';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

// Lazy loaded components
const GirlPostsComp = lazy(() => import("@/app/components/posts/GirlPostsComp"));

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

export default function MediaItemsSection({ items, girlId }) {
    const user = useStore((state) => state.user);
    
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <Grid container spacing={3}>
                {items.map((item, index) => (
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                        <GirlPostsComp
                            girl={girlId}
                            user={user}
                            post={item}
                            index={index}
                        />
                    </Grid>
                ))}
            </Grid>
        </Suspense>
    );
}