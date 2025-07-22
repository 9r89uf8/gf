'use client';
import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import { getGirls } from "@/app/services/girlsService";
import { useStore } from '@/app/store/store';
import PostForm from '@/app/components/admin/posts/PostForm';
import PostsTable from '@/app/components/admin/posts/PostsTable';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

export default function AdminPostsPage() {
    const girls = useStore((state) => state.girls);
    const [selectedGirl, setSelectedGirl] = useState('');
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Fetch girls on component mount
    useEffect(() => {
        getGirls()
    }, []);

    useEffect(() => {
        if (selectedGirl) {
            fetchPosts();
        }
    }, [selectedGirl]);

    const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
            const response = await fetch(`/api/v2/posts/admin/list?girlId=${selectedGirl}`);
            const data = await response.json();
            if (response.ok) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handlePostCreated = () => {
        if (selectedGirl) {
            fetchPosts();
        }
    };

    const handleDeleteSuccess = () => {
        fetchPosts();
    };

    const handleGirlSelected = (girlId) => {
        setSelectedGirl(girlId);
        // Clear posts when switching girls
        setPosts([]);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                py: 4
            }}
        >
            <Container maxWidth="xl">
                {/* Page Title */}
                <Typography
                    variant="h3"
                    sx={{
                        color: 'rgba(15, 23, 42, 0.95)',
                        fontWeight: 700,
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    Posts Management
                </Typography>

                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 5 }}>
                        <PostForm 
                            girls={girls} 
                            onPostCreated={handlePostCreated}
                            onGirlSelected={handleGirlSelected}
                            selectedGirl={selectedGirl}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: 7 }}>
                        <PostsTable 
                            posts={posts}
                            loading={loadingPosts}
                            selectedGirl={selectedGirl}
                            onRefresh={fetchPosts}
                            onDelete={handleDeleteSuccess}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}