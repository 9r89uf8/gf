'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getClips } from '@/app/services/clipsService';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const ClipsVideos = () => {
    const router = useRouter();
    const { clips, hasHydrated } = useStore((state) => ({
        clips: state.clips,
        hasHydrated: state.hasHydrated,
    }));
    const [isLoading, setIsLoading] = useState(true);
    const videoRefs = useRef([]);

    // Fetch clips when the store has hydrated
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

    // Intersection Observer to auto play/pause videos
    useEffect(() => {
        if (!clips || clips.length === 0) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.9, // Adjust this threshold as needed
        };

        const handlePlayPause = (entries) => {
            entries.forEach((entry) => {
                const index = parseInt(entry.target.dataset.index);
                const videoElement = entry.target;
                if (entry.isIntersecting) {
                    if (videoElement.paused && !clips[index].premium) {
                        videoElement.play();
                    }
                } else {
                    if (!videoElement.paused) {
                        videoElement.pause();
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handlePlayPause, options);

        videoRefs.current.forEach((video) => {
            if (video) {
                observer.observe(video);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [clips]);

    // Function to handle play/pause on click
    const handleVideoClick = (index) => {
        const videoElement = videoRefs.current[index];
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    };

    // Function to navigate home
    const handleHomeClick = () => {
        router.push('/novia-virtual');
    };

    // Function to scroll to the next video
    const scrollToNextVideo = (currentIndex) => {
        if (currentIndex < clips.length - 1) {
            videoRefs.current[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        } else {
            // Optionally, loop back to the first video
            videoRefs.current[0].scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Conditional rendering after all hooks have been called
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

    return (
        <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
            <Box
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    overflowY: 'scroll',
                    scrollSnapType: 'y mandatory',
                }}
            >
                {clips.map((clip, index) => (
                    <Box
                        key={index}
                        style={{
                            position: 'relative',
                            height: '100vh',
                            scrollSnapAlign: 'start',
                        }}
                    >
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            src={'https://d3sog3sqr61u3b.cloudfront.net/' + clip.videoId}
                            data-index={index}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            controls={false}
                            loop={false}
                            muted
                            playsInline
                            onClick={() => handleVideoClick(index)}
                            onEnded={() => {
                                scrollToNextVideo(index);
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                        />

                        {clip.premium && (
                            <Box
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: '#fff',
                                }}
                            >
                                <Typography>This video is for premium members only.</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ backgroundColor: '#fff', color: '#000' }}
                                    onClick={() => router.push('/premium')}
                                >
                                    Get Premium
                                </Button>
                            </Box>
                        )}
                    </Box>
                ))}

                <Box
                    style={{
                        position: 'fixed',
                        top: '5%',
                        left: '5%',
                    }}
                >
                    <Button
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        variant="contained"
                        onClick={handleHomeClick}
                    >
                        <HomeIcon fontSize="large" />
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default ClipsVideos;


