import React, { useState, useRef } from 'react';
import { IconButton, LinearProgress, Box, styled } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';

const AudioRecorderContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const RecordingIndicator = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.error.main,
}));

const AudioRecorder = ({ onAudioRecorded, isRecording, setIsRecording, canSendMessage }) => {
    const [audioDuration, setAudioDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
                onAudioRecorded(audioBlob);
                chunksRef.current = [];
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Start duration timer
            let duration = 0;
            timerRef.current = setInterval(() => {
                duration += 1;
                setAudioDuration(duration);
                // Stop recording after 60 seconds
                if (duration >= 60) {
                    stopRecording();
                }
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please ensure you have granted permission.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            clearInterval(timerRef.current);
            setIsRecording(false);
            setAudioDuration(0);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            chunksRef.current = [];
            clearInterval(timerRef.current);
            setIsRecording(false);
            setAudioDuration(0);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AudioRecorderContainer>
            {isRecording ? (
                <>
                    <RecordingIndicator>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <StopIcon />
                        </motion.div>
                        {formatDuration(audioDuration)}
                    </RecordingIndicator>
                    <LinearProgress
                        variant="determinate"
                        value={(audioDuration / 60) * 100}
                        sx={{ flex: 1 }}
                    />
                    <IconButton onClick={stopRecording} color="primary">
                        <StopIcon />
                    </IconButton>
                    <IconButton onClick={cancelRecording} color="error">
                        <DeleteIcon />
                    </IconButton>
                </>
            ) : (
                <IconButton onClick={startRecording} disabled={!canSendMessage}>
                    <MicIcon fontSize="large" />
                </IconButton>
            )}
        </AudioRecorderContainer>
    );
};

export default AudioRecorder;