'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getReels } from "@/app/services/clipsService";
import ReelsComp from "@/app/components/reels/ReelsComp";
import { Container, Box, Grid, Typography, Button } from '@mui/material';
import Link from "next/link";
import GridOnIcon from "@mui/icons-material/GridOn";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

const Reels = () => {
    const user = useStore((state) => state.user);
    const reels = useStore((state) => state.reels);

    // Number of posts to display; starts at 3.
    const [visibleCount, setVisibleCount] = useState(3);

    // Ref for the element that will trigger loading more posts.
    const loadMoreRef = useRef(null);

    // Initially load all posts (or fetch if using paginated backend)
    useEffect(() => {
        getReels();
    }, []);

    // Setup the intersection observer to watch the sentinel element.
    useEffect(() => {
        // Make sure we have posts and more posts to show.
        if (!reels || visibleCount >= reels.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // When the sentinel element is visible...
                if (entries[0].isIntersecting) {
                    // Increase the number of visible posts.
                    setVisibleCount((prevCount) => Math.min(prevCount + 2, reels.length));
                }
            },
            {
                rootMargin: '100px', // Optional: trigger loading a bit before the user reaches the bottom.
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        // Cleanup the observer on component unmount or when dependencies change.
        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [reels, visibleCount]);

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
                    {/* Reels Button (inactive) */}
                    <Button
                        component={Link}
                        href="/reels"
                        variant="contained"
                        sx={{
                            borderRadius: '50%',
                            minWidth: 64,    // Increased width
                            minHeight: 64,   // Increased height
                            padding: 0,
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
                            },
                        }}
                    >
                        <OndemandVideoIcon sx={{ color: '#ffffff', fontSize: 32 }} />
                    </Button>

                    {/* Posts Button (active) */}
                    <Button
                        component={Link}
                        href="/posts"
                        variant="outlined"
                        sx={{
                            borderRadius: '50%',
                            minWidth: 64,    // Increased width
                            minHeight: 64,   // Increased height
                            padding: 0,
                            background: 'transparent',
                            '&:hover': {
                                background: 'rgba(63, 81, 181, 0.1)',
                            },
                        }}
                    >
                        <GridOnIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Button>


                </Box>

                <Grid container spacing={3}>
                    {reels && reels.slice(0, visibleCount).map((post, index) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id || index}>
                            <ReelsComp
                                user={user}
                                post={post}
                                index={index}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Sentinel element for Intersection Observer */}
                {visibleCount < reels?.length && (
                    <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">cargando...</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Reels;
