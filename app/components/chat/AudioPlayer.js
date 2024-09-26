import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, LinearProgress, styled } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import {alpha} from "@mui/material/styles";

const PlayerWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    overflow: 'visible',
}));

const AudioPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(new Audio(src));
    const intervalRef = useRef();

    useEffect(() => {
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            startTimer();
        } else {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
    }, [isPlaying]);

    const startTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                setIsPlaying(false);
                setProgress(0);
            } else {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        }, 1000);
    };

    const togglePlayPause = () => setIsPlaying(!isPlaying);

    return (
        <PlayerWrapper>
            <IconButton onClick={togglePlayPause} color="primary" size="small">
                {isPlaying ? <PauseRoundedIcon sx={{ fontSize: 36 }}/> : <PlayArrowRoundedIcon sx={{ fontSize: 36 }}/>}
            </IconButton>
            <Box sx={{ flexGrow: 1, ml: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 4,
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                        },
                    }}
                />
            </Box>
        </PlayerWrapper>
    );
};

export default AudioPlayer;
