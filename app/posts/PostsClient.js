'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import GirlPostsComp from "@/app/components/posts/GirlPostsComp";
import { useStore } from '@/app/store/store';

export default function PostsClient({ initialPosts }) {
    const user = useStore((state) => state.user);
    const [posts, setPosts] = useState(initialPosts);
    const [visibleCount, setVisibleCount] = useState(initialPosts.length);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreRef = useRef(null);

    // Load more posts from API
    const loadMorePosts = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            const response = await fetch('/api/v2/posts/getAllPosts');
            if (response.ok) {
                const allPosts = await response.json();
                setPosts(allPosts);
                
                // If we've loaded all posts, stop trying to load more
                if (visibleCount >= allPosts.length) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Setup intersection observer for infinite scroll
    useEffect(() => {
        if (!hasMore || visibleCount >= posts.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Show more posts from what we already have
                    setVisibleCount((prevCount) => {
                        const newCount = Math.min(prevCount + 6, posts.length);
                        
                        // If we're showing all posts we have, try to load more
                        if (newCount === posts.length && hasMore) {
                            loadMorePosts();
                        }
                        
                        return newCount;
                    });
                }
            },
            {
                rootMargin: '100px',
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [posts, visibleCount, hasMore]);

    return (
        <>
            {/* Posts Grid */}
            <Grid container spacing={3}>
                {posts.slice(0, visibleCount).map((post, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id || index}>
                        <GirlPostsComp
                            girl={post.girlId}
                            user={user}
                            post={post}
                            index={index}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Sentinel element for Intersection Observer */}
            {visibleCount < posts.length && (
                <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2">cargando...</Typography>
                </Box>
            )}
        </>
    );
}