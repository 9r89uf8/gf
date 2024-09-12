import React, {useState} from 'react';
import {Box, Button, Paper, Typography} from '@mui/material';
import VideoPlayer from "@/app/components/videoPlayer/VideoPlayer";
import Grid from "@mui/material/Grid";
import {alpha, styled} from "@mui/material/styles";
import Avatar from '@mui/material/Avatar';

const ItemTwo = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: '#ffffff',
    background: 'linear-gradient(45deg, #343a40, #001219)', // semi-transparent white
    backdropFilter: 'blur(10px)', // apply blur
    borderRadius: '0px 0px 10px 10px', // rounded corners
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
}));

function GirlPostComp({ girl, user, post, index }) {

    return (

            <Grid item xs={12} sm={6} key={index} style={{ position: 'relative' }}>
                {post.image ? (
                    <img
                        src={'https://d3sog3sqr61u3b.cloudfront.net/' + post.image}
                        alt={`Post ${index}`}
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px 10px 0px 0px' }}
                    />
                ) : post.video ? (
                    <>
                        <VideoPlayer
                            options={{
                                controls: true,
                                sources: [{
                                    src: 'https://d3sog3sqr61u3b.cloudfront.net/' + post.video,
                                    type: 'video/mp4'
                                }],
                                controlBar: {
                                    // Add or remove controls here
                                    volumePanel: true,
                                    fullscreenToggle: false, // Set this to false to hide fullscreen control
                                },
                            }}

                        />
                    </>
                ) : null}
            </Grid>

    );
}

export default GirlPostComp;