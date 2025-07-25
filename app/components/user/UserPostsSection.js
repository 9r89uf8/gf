'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Avatar,
    AvatarGroup,
    Button,
    CircularProgress,
    Fab,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PostUploadModal from './PostUploadModal';
import { ModernCard } from '@/app/components/ui/ModernCard';

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    color: '#ffffff',
    '&:hover': {
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    }
}));

const PostCard = styled(ModernCard)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
}));

const UserPostsSection = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [deletingPost, setDeletingPost] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/v2/user-posts/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            setPosts(data.posts || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = async (postId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            return;
        }

        setDeletingPost(postId);
        try {
            const response = await fetch(`/api/v2/user-posts/delete?postId=${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setPosts(posts.filter(post => post.id !== postId));
        } catch (err) {
            setError('Error al eliminar la publicación');
        } finally {
            setDeletingPost(null);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
        setOpenUploadModal(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress sx={{ color: '#1a1a1a' }} />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mb: 3, 
                        fontWeight: 700,
                        color: 'rgba(15, 23, 42, 0.95)'
                    }}
                >
                    Mis Publicaciones
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {posts.length === 0 ? (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            color: 'rgba(71, 85, 105, 0.8)'
                        }}
                    >
                        <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6">
                            No tienes publicaciones aún
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            ¡Comparte tu primera foto!
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {posts.map((post) => (
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                                <PostCard variant="flat" animate={false}>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={post.imageUrl}
                                        alt="User post"
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {post.text && (
                                            <Typography variant="body2" color="text.secondary">
                                                {post.text}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FavoriteIcon sx={{ color: '#8992ff', fontSize: 20 }} />
                                            <Typography variant="body2">
                                                {post.likes.length}
                                            </Typography>
                                            {post.likes.length > 0 && (
                                                <AvatarGroup max={3} sx={{ ml: 1 }}>
                                                    {post.likes.map((like, index) => (
                                                        <Avatar
                                                            key={index}
                                                            src={like.profilePic}
                                                            sx={{ width: 24, height: 24 }}
                                                        />
                                                    ))}
                                                </AvatarGroup>
                                            )}
                                        </Box>
                                        <IconButton
                                            onClick={() => handleDeletePost(post.id)}
                                            disabled={deletingPost === post.id}
                                            sx={{ color: '#ef4444' }}
                                        >
                                            {deletingPost === post.id ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <DeleteIcon />
                                            )}
                                        </IconButton>
                                    </CardActions>
                                </PostCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <StyledFab
                onClick={() => setOpenUploadModal(true)}
                aria-label="add post"
            >
                <AddPhotoAlternateIcon />
            </StyledFab>

            <PostUploadModal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
                onPostCreated={handlePostCreated}
            />
        </>
    );
};

export default UserPostsSection;