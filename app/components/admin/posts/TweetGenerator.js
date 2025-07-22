import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const GenerateButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
    color: 'white',
    padding: '8px 16px',
    '&:hover': {
        background: 'linear-gradient(45deg, #AB47BC 30%, #EC407A 90%)',
    },
    '&:disabled': {
        background: 'rgba(255, 255, 255, 0.12)',
    },
}));

export default function TweetGenerator({ girlId, onTweetGenerated, disabled }) {
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateTweet = async () => {
        if (!girlId) {
            setError('Please select a girl first');
            return;
        }

        setGenerating(true);
        setError('');

        try {
            const response = await fetch('/api/v2/posts/generate-tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ girlId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate tweet');
            }

            onTweetGenerated(data.tweet);
        } catch (error) {
            console.error('Error generating tweet:', error);
            setError(error.message);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <GenerateButton
            onClick={handleGenerateTweet}
            disabled={disabled || generating || !girlId}
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
        >
            {generating ? 'Generating...' : 'Generate Tweet'}
        </GenerateButton>
    );
}