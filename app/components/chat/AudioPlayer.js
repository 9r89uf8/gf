import React from 'react';
import { Box, IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const AudioPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [audio] = React.useState(new Audio(src));
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.pause();
        };
    }, [audio]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <IconButton onClick={togglePlayPause}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <Slider value={progress} sx={{ flex: 1 }} />
        </Box>
    );
};

export default AudioPlayer;
