'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Grid, Box, Typography, Chip, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlogCard from '@/app/components/blog/BlogCard';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        color: 'rgba(15, 23, 42, 0.95)',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(71, 85, 105, 0.8)',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 25,
        '& fieldset': {
            borderColor: 'rgba(203, 213, 225, 0.5)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(15, 23, 42, 0.8)',
        },
    },
}));

const categories = [
    'Todos',
    'Inteligencia Artificial',
    'Relaciones Virtuales',
    'Tecnología',
    'Consejos',
    'Novedades'
];

export default function BlogClient({ initialPosts }) {
    const [posts, setPosts] = useState(initialPosts);
    const [filteredPosts, setFilteredPosts] = useState(initialPosts);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const loadMoreRef = useRef(null);

    // Filter posts based on category and search
    useEffect(() => {
        let filtered = posts;

        // Category filter
        if (selectedCategory !== 'Todos') {
            filtered = filtered.filter(post => post.category === selectedCategory);
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredPosts(filtered);
    }, [posts, selectedCategory, searchQuery]);

    // Load more posts
    const loadMorePosts = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            const response = await fetch(`/api/v2/blog/posts?page=${page + 1}&limit=9`);
            if (response.ok) {
                const data = await response.json();
                if (data.posts.length === 0) {
                    setHasMore(false);
                } else {
                    setPosts(prev => [...prev, ...data.posts]);
                    setPage(prev => prev + 1);
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
        if (!hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMorePosts();
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
    }, [hasMore, page]);

    return (
        <>
            {/* Search and Filters */}
            <Box sx={{ mb: 4 }}>
                {/* Search Bar */}
                <StyledTextField
                    fullWidth
                    placeholder="Buscar artículos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'rgba(71, 85, 105, 0.8)' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />

                {/* Category Chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {categories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            onClick={() => setSelectedCategory(category)}
                            sx={{
                                backgroundColor: selectedCategory === category 
                                    ? 'rgba(15, 23, 42, 0.95)' 
                                    : 'rgba(255, 255, 255, 0.8)',
                                color: selectedCategory === category 
                                    ? '#ffffff' 
                                    : 'rgba(71, 85, 105, 0.8)',
                                fontWeight: 600,
                                border: '1px solid rgba(203, 213, 225, 0.5)',
                                '&:hover': {
                                    backgroundColor: selectedCategory === category 
                                        ? 'rgba(15, 23, 42, 0.85)' 
                                        : 'rgba(241, 245, 249, 1)',
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Blog Posts Grid */}
            <Grid container spacing={3}>
                {filteredPosts.map((post) => (
                    <Grid key={post.id} item size={{ xs: 12, sm: 6, md: 4 }}>
                        <BlogCard post={post} />
                    </Grid>
                ))}
            </Grid>

            {/* No Results Message */}
            {filteredPosts.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                        No se encontraron artículos
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.6)', mt: 1 }}>
                        Intenta con otros términos de búsqueda o categorías
                    </Typography>
                </Box>
            )}

            {/* Load More Sentinel */}
            {hasMore && filteredPosts.length > 0 && (
                <Box ref={loadMoreRef} sx={{ textAlign: 'center', mt: 4 }}>
                    {loading && (
                        <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                            Cargando más artículos...
                        </Typography>
                    )}
                </Box>
            )}
        </>
    );
}