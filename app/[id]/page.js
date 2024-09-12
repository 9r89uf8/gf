'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import { useStore } from '@/app/store/store';
import {getGirl} from "@/app/services/girlService";
import PostsFilter from "@/app/components/posts/PostsFilter";
import { useRouter } from 'next/navigation';
import GirlPostsComp from "@/app/components/posts/GirlPostsComp";
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from "@mui/material/styles";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: '#ffffff',
    background: 'linear-gradient(45deg, #343a40, #001219)',
    backdropFilter: 'blur(10px)',
    borderRadius: 10,
    border: `1px solid ${theme.palette.divider}`,
}));

const GirlProfile = () => {
    const params = useParams(); // Use useParams to access route parameters
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);

    const router = useRouter();
    useEffect(() => {
        getGirl(); // Access the id parameter
    }, []);


    const handleChat = () => {
        router.push('/chat');
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" height="80vh" overflow="auto">
                {girl && (
                    <Item elevation={4}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar
                                variant="square"
                                src={'https://d3sog3sqr61u3b.cloudfront.net/' + girl.picture}
                                sx={{ width: 116, height: 116, borderRadius: '10%' }}
                            />
                        </div>
                        <Typography variant="h5" gutterBottom>
                            {girl.username} <CheckCircleIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {girl.bio}
                        </Typography>
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button
                                onClick={() => handleChat()}
                                style={{
                                    backgroundImage: 'linear-gradient(45deg, #32cd32, #008080)',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 3px 5px 2px rgba(50, 205, 50, .3)',
                                }}
                            >
                                Mensaje
                            </Button>
                        </Box>
                    </Item>
                )}
                <div>
                    <PostsFilter postsCount={girl.posts.length}/>
                </div>

            </Box>



            {girl&&girl.posts&&
                <Grid container spacing={2} style={{ marginTop: 1 }}>
                    {girl.posts.map((post, index) => (
                        <GirlPostsComp
                            key={index}
                            girl={post.girlId}
                            user={user}
                            post={post}
                            index={index}
                        />
                    ))}
                </Grid>
            }

        </Container>
    );
};

export default GirlProfile;
