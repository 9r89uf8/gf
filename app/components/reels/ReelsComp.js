'use client'
import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Grid,
    IconButton,
    Avatar,
    Modal,
} from '@mui/material';
import VideoPlayer from "@/app/components/videoPlayer/VideoPlayer";
import {likeReel} from "@/app/services/clipsService";
import { styled } from "@mui/material/styles";
import LockIcon from '@mui/icons-material/Lock';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';
import { useRouter } from "next/navigation";

// Styled Components

const PostCard = styled(Paper)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    margin: theme.spacing(2, 0),
    userSelect: 'none',
    overflow: 'hidden',
}));


const MediaWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    maxHeight: '500px',
    overflow: 'hidden',
});

const PostImage = styled('img')({
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});


const Actions = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
}));


// Modal Style
const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    p: 0, // Remove padding
};


// Main Component

function GirlPostComp({ user, post, index, onLike }) {
    const router = useRouter();
    const isUserLoggedIn = !!user;

    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleLike = async () => {
        if (isUserLoggedIn) {
            await likeReel({ postId: post.id });
            if (onLike) onLike(post.id);
        } else {
            // Redirect to login or show a login prompt
            console.log("User must be logged in to like posts");
        }
    };


    const handleImageClick = () => {
        setIsFullscreen(true);
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <>
            <PostCard elevation={3}>
                {/* Media */}
                <MediaWrapper>
                    {post.image ? (
                        <>
                            <PostImage
                                src={`https://d3sog3sqr61u3b.cloudfront.net/${post.image}`}
                                alt={`Post ${index}`}
                                onClick={handleImageClick}
                                style={{ cursor: 'pointer' }}
                            />
                        </>
                    ) : post.video ? (
                        <VideoPlayer
                            options={{
                                controls: true,
                                sources: [{
                                    src: `https://d3sog3sqr61u3b.cloudfront.net/${post.video}`,
                                    type: 'video/mp4'
                                }],
                                controlBar: {
                                    volumePanel: true,
                                    fullscreenToggle: false,
                                },
                            }}
                        />
                    ) : null}
                </MediaWrapper>

                {/* Actions */}
                <Actions>
                    <IconButton onClick={handleLike} color="inherit">
                        {user && post.likes.includes(user.uid) ? (
                            <FavoriteIcon color="error" style={{ fontSize: 36, marginBottom: -12, marginTop: -10 }}/>
                        ) : (
                            <FavoriteBorderIcon style={{ fontSize: 36, marginBottom: -12, marginTop: -10 }} />
                        )}
                    </IconButton>
                    <Typography variant="h6" sx={{ marginLeft: 1 }}>
                        {post.likesAmount} Likes
                    </Typography>
                    {/* Additional action buttons can be added here (e.g., Comment, Share) */}
                </Actions>
            </PostCard>

            {/* Fullscreen Modal */}
            {post.image && (
                <Modal
                    open={isFullscreen}
                    onClose={handleCloseFullscreen}
                    aria-labelledby="fullscreen-image-modal"
                    aria-describedby="modal-to-display-fullscreen-image"
                    disableScrollLock
                >
                    <Box sx={modalStyle}>
                        <img
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${post.image}`}
                            alt={`Post ${index} Fullscreen`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain', // Maintain aspect ratio
                                borderRadius: '0', // Remove border radius for a cleaner look
                                cursor: 'pointer',
                            }}
                            onClick={handleCloseFullscreen}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default GirlPostComp;