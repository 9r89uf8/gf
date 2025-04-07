'use client';

import React, { lazy, Suspense } from 'react';
import { useStore } from '@/app/store/store';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { alpha, styled } from "@mui/material/styles";
import Skeleton from '@mui/material/Skeleton';

// Lazy loaded components
const PostsFilter = lazy(() => import("@/app/components/posts/PostsFilter"));
const GirlPostsComp = lazy(() => import("@/app/components/posts/GirlPostsComp"));

const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    marginTop: 10,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}));

// Loading fallback for lazy components
const LoadingSkeleton = () => (
    <Grid container spacing={3}>
        {[...Array(9)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
        ))}
    </Grid>
);

export default function GirlPostsSection({ girl }) {
    const user = useStore((state) => state.user);
    return (
        <>
            <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={60} />}>
                <GlassCard>
                    <PostsFilter postsCount={girl.posts.length} />
                </GlassCard>
            </Suspense>

            <Suspense fallback={<LoadingSkeleton />}>
                <Grid container spacing={3}>
                    {girl.posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
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