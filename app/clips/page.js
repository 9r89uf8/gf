// ClipsVideos.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getClips } from '@/app/services/clipsService';
import {
    Box,
    Button,
    Typography,
    IconButton,
    CircularProgress,
    Card,
    CardMedia,
} from '@mui/material';
import {
    ArrowBackIos as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
    Home as HomeIcon,
} from '@mui/icons-material';

const ClipsVideos = () => {
    const router = useRouter();
    const {
        clips,
        hasHydrated,
        user,
        currentClipIndex,
        setCurrentClipIndex,
    } = useStore((state) => ({
        clips: state.clips,
        hasHydrated: state.hasHydrated,
        user: state.user,
        currentClipIndex: state.currentClipIndex,
        setCurrentClipIndex: state.setCurrentClipIndex,
    }));
    const [isLoading, setIsLoading] = useState(true);
    const [videosPlayed, setVideosPlayed] = useState(0);

    useEffect(() => {
        if (!hasHydrated) return;

        const fetchClips = async () => {
            if (clips && clips.length > 0) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            await getClips();
            setIsLoading(false);
        };

        fetchClips();
    }, [hasHydrated]);

    if (!hasHydrated || isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!clips || clips.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6">No clips available</Typography>
            </Box>
        );
    }

    const isPremiumUser = user && user.premium;
    const isLimitedUser = !isPremiumUser;
    const playLimitReached = isLimitedUser && videosPlayed >= 10;

    const currentClip = clips[currentClipIndex];

    const handleNextClick = () => {
        if (playLimitReached) return;
        setCurrentClipIndex((prevIndex) => (prevIndex + 1) % clips.length);
    };

    const handlePreviousClick = () => {
        if (playLimitReached) return;
        setCurrentClipIndex((prevIndex) => (prevIndex - 1 + clips.length) % clips.length);
    };


    const handleBuyClick = () => {
        router.push('/premium');
    };

    const handleHomeClick = () => {
        router.push('/novia-virtual');
    };

    const handleVideoPlay = () => {
        if (isLimitedUser) {
            if (videosPlayed >= 10) {
                return;
            } else {
                setVideosPlayed((prev) => prev + 1);
            }
        }
    };

    const handleVideoEnded = () => {
        if (!playLimitReached) {
            handleNextClick();
        }
    };

    return (
        <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
            <Box style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
                <Card style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
                    <CardMedia
                        component="video"
                        image={'https://d3sog3sqr61u3b.cloudfront.net/' + currentClip.videoId}
                        title="tiktok"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        controlsList="nodownload"
                        onPlay={handleVideoPlay}
                        onEnded={handleVideoEnded}
                        controls={!currentClip.premium && !playLimitReached}
                        autoPlay={!(playLimitReached || currentClip.premium)}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </Card>

                {(currentClip.premium || playLimitReached) && (
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
                            backdropFilter: 'blur(10px)',
                            padding: '20px',
                            borderRadius: '10px',
                            color: '#fff',
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            {playLimitReached
                                ? 'Has alcanzado el límite de 10 vídeos. Obtén Premium para ver más.'
                                : 'This video is for premium members only.'}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: '#fff', color: '#000' }}
                            onClick={handleBuyClick}
                        >
                            Comprar
                        </Button>
                    </Box>
                )}

                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: '15%',
                        width: '100%',
                    }}
                >
                    <IconButton
                        style={{ background: 'linear-gradient(to right, #ffbd00, #ff5400)' }}
                        variant="contained"
                        onClick={handlePreviousClick}
                        disabled={playLimitReached}
                    >
                        <ArrowBackIosIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                        style={{ background: 'linear-gradient(to right, #ffbd00, #ff5400)' }}
                        variant="contained"
                        onClick={handleNextClick}
                        disabled={playLimitReached}
                    >
                        <ArrowForwardIosIcon fontSize="large" />
                    </IconButton>
                </Box>

                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '5%',
                        width: '100%',
                        paddingLeft: '10px',
                    }}
                >
                    <IconButton
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        variant="contained"
                        onClick={handleHomeClick}
                    >
                        <HomeIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Box>
        </div>
    );
};

export default ClipsVideos;

