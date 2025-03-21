'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '@/app/store/store';
import { getPosts } from "@/app/services/postsService";
import GirlPostsComp from "@/app/components/posts/GirlPostsComp";
import { Container, Box, Grid, Typography, Button } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

const Posts = () => {
    const user = useStore((state) => state.user);
    const posts = useStore((state) => state.posts);

    // Number of posts to display; starts at 3.
    const [visibleCount, setVisibleCount] = useState(3);
    // Ref for the element that will trigger loading more posts.
    const loadMoreRef = useRef(null);

    // Initially load posts.
    useEffect(() => {
        getPosts();
    }, []);

    // Setup the intersection observer to watch the sentinel element.
    useEffect(() => {
        if (!posts || visibleCount >= posts.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prevCount) => Math.min(prevCount + 2, posts.length));
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
    }, [posts, visibleCount]);

    return (
        <Box sx={{ minHeight: "100vh", padding: 2 }}>
            <Container maxWidth="md">
                {/* Navigation Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2, // Adds space between the buttons
                        mb: 0,
                    }}
                >
                    {/* Posts Button (active) */}
                    <Button
                        component={Link}
                        href="/posts"
                        variant="contained"
                        sx={{
                            borderRadius: '50%',
                            minWidth: 64,
                            minHeight: 64,
                            padding: 0,
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
                            },
                        }}
                    >
                        <GridOnIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Button>

                    {/* Reels Button (inactive) */}
                    <Button
                        component={Link}
                        href="/reels"
                        variant="outlined"
                        sx={{
                            borderRadius: '50%',
                            minWidth: 64,
                            minHeight: 64,
                            padding: 0,
                            background: 'transparent',
                            '&:hover': {
                                background: 'rgba(63, 81, 181, 0.1)',
                            },
                        }}
                    >
                        <OndemandVideoIcon sx={{ color: '#3f51b5', fontSize: 32 }} />
                    </Button>
                </Box>

                {/* Posts Grid */}
                <Grid container spacing={3}>
                    {posts &&
                        posts.slice(0, visibleCount).map((post, index) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id || index}>
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
                {visibleCount < posts?.length && (
                    <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">cargando...</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Posts;

