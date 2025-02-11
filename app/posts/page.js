'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getPosts } from "@/app/services/postsService";
import GirlPostsComp from "@/app/components/posts/GirlPostsComp";
import { Container, Box, Grid, Typography } from '@mui/material';

const Posts = () => {
    const user = useStore((state) => state.user);
    const posts = useStore((state) => state.posts);

    // Number of posts to display; starts at 3.
    const [visibleCount, setVisibleCount] = useState(3);

    // Ref for the element that will trigger loading more posts.
    const loadMoreRef = useRef(null);

    // Initially load all posts (or fetch if using paginated backend)
    useEffect(() => {
        getPosts();
    }, []);

    // Setup the intersection observer to watch the sentinel element.
    useEffect(() => {
        // Make sure we have posts and more posts to show.
        if (!posts || visibleCount >= posts.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // When the sentinel element is visible...
                if (entries[0].isIntersecting) {
                    // Increase the number of visible posts.
                    setVisibleCount((prevCount) => Math.min(prevCount + 2, posts.length));
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
    }, [posts, visibleCount]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                padding: 2
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    {posts && posts.slice(0, visibleCount).map((post, index) => (
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

                {/*
          The sentinel element that the Intersection Observer watches.
          It doesn't have to be visible (or could include a loading indicator if you like).
        */}
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
