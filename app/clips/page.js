'use client';
'use client';
import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { useRouter } from 'next/navigation';
import CardMedia from "@mui/material/CardMedia";
import { useStore } from '@/app/store/store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HomeIcon from '@mui/icons-material/Home';
import CircularProgress from '@mui/material/CircularProgress';
import {getClips} from "@/app/services/clipsService";

const ClipsVideos = () => {
    const router = useRouter();
    const clips = useStore((state) => state.clips);
    const [currentClipIndex, setCurrentClipIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClips = async () => {
            setIsLoading(true);
            await getClips();
            setIsLoading(false);
        };
        fetchClips();
    }, []);

    const handleNextClick = () => {
        setCurrentClipIndex((prevIndex) => (prevIndex + 1) % clips.length);
    }

    const handlePreviousClick = () => {
        setCurrentClipIndex((prevIndex) => (prevIndex - 1 + clips.length) % clips.length);
    }

    const handleBuyClick = () => {
        router.push('/premium');
    }

    const handleHomeClick = () => {
        router.push('/novia-virtual');
    }

    if (isLoading) {
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

    const currentClip = clips[currentClipIndex];

    return (
        <div style={{ margin: 0, padding: 0, overflow: 'hidden'}}>
            <Box style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
                <Card style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
                    <CardMedia
                        component="video"
                        image={'https://d3sog3sqr61u3b.cloudfront.net/' + currentClip.videoId}
                        title="tiktok"
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        controlsList="nodownload"
                        onEnded={handleNextClick}
                        {...(!currentClip.premium && {controls: true, autoPlay: true})}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </Card>

                {currentClip.premium && (
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
                        <p>This video is for premium members only.</p>
                        <Button variant="contained" color="primary" style={{ backgroundColor: '#fff', color: '#000' }} onClick={handleBuyClick}>
                            Get Premium
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
                        width: '100%'
                    }}
                >
                    <IconButton style={{background: 'linear-gradient(to right, #ffbd00, #ff5400)'}} variant="contained" onClick={handlePreviousClick}>
                        <ArrowBackIosIcon fontSize='large' />
                    </IconButton>
                    <IconButton style={{background: 'linear-gradient(to right, #ffbd00, #ff5400)'}} variant="contained" onClick={handleNextClick}>
                        <ArrowForwardIosIcon fontSize='large' />
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
                        paddingLeft: '10px'
                    }}
                >
                    <IconButton style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}} variant="contained" onClick={handleHomeClick}>
                        <HomeIcon fontSize='large'/>
                    </IconButton>
                </Box>
            </Box>
        </div>
    );
};

export default ClipsVideos;