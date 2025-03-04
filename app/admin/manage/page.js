'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getGirl, deleteGirl, addTweetToGirl } from "@/app/services/girlService";
import {deleteGirlPost, deleteGirlPicture, deleteGirlVideo} from "@/app/services/postsService";
import GirlPostsComp from "@/app/components/posts/GirlPostsComp";
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    Avatar,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    CircularProgress,
} from '@mui/material';
import { alpha, styled } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import VideoPlayer from "@/app/components/videoPlayer/VideoPlayer";

// Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    marginTop: 10,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: `4px solid ${alpha('#ffffff', 0.5)}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    margin: 'auto',
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
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

const ManageGirlPosts = () => {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const girls = useStore((state) => state.girls); // List of girls
    const selectedGirl = useStore((state) => state.girl); // Currently selected girl

    const [loading, setLoading] = useState(false);
    // Handle girl selection
    const handleSelectGirl = async (girlId) => {
        setLoading(true);
        try {
            await getGirl({ id: girlId }); // Assuming getGirl updates the store
        } catch (error) {
            console.error('Error fetching girl:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle girl deletion
    const handleDeleteGirl = async () => {
        if (!selectedGirl) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedGirl.username}?`);
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await deleteGirl({ girlId: selectedGirl.id });
            alert('Girl deleted successfully.');
        } catch (error) {
            console.error('Error deleting girl:', error);
            alert('Failed to delete the girl.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTweet = async () => {
        if (!selectedGirl) return;

        setLoading(true);
        try {
            let post = await addTweetToGirl({ girlId: selectedGirl.id });
            alert(post.text);
        } catch (error) {
            console.error('Error creating tweet:', error);
            alert('Failed to create tweet.');
        } finally {
            setLoading(false);
        }
    };

    // Handle post deletion
    const handleDeletePost = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await deleteGirlPost({ postId: postId });
            // Update the girl's posts in the store
            alert('Post deleted successfully.');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete the post.');
        } finally {
            setLoading(false);
        }
    };

    // Handle picture deletion
    const handleDeletePicture = async (pictureId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this picture?');
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await deleteGirlPicture({ pictureId: pictureId });
            // Update the girl's posts in the store
            alert('Picture deleted successfully.');
        } catch (error) {
            console.error('Error deleting picture:', error);
            alert('Failed to delete the picture.');
        } finally {
            setLoading(false);
        }
    };

    // Handle video deletion
    const handleDeleteVideo = async (videoId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this video?');
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await deleteGirlVideo({ videoId: videoId });
            // Update the girl's posts in the store
            alert('Video deleted successfully.');
        } catch (error) {
            console.error('Error deleting Video:', error);
            alert('Failed to delete the Video.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(45deg, #343a40 0%, #212529 100%)',
                padding: 2
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Girls List */}
                    <Grid item xs={12} md={4}>
                        <GlassCard elevation={4}>
                            <Typography variant="h5" gutterBottom sx={{ color: 'white', marginBottom: 2 }}>
                                Girls List
                            </Typography>
                            <List>
                                {girls.map(girl => (
                                    <React.Fragment key={girl.id}>
                                        <ListItem button onClick={() => handleSelectGirl(girl.id)} selected={selectedGirl?.id === girl.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                                    alt={girl.username}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={girl.username}
                                                secondary={`Age: ${girl.age}, Country: ${girl.country}`}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                            {loading && <Typography>Loading selected girl...</Typography>}
                        </GlassCard>
                    </Grid>

                    {/* Girl Details and Posts */}
                    <Grid item xs={12} md={8}>
                        {selectedGirl ? (
                            <GlassCard elevation={4}>
                                {loading ? (
                                    <CircularProgress color="secondary" />
                                ) : (
                                    <>
                                        {/* Girl Info */}
                                        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                                            <StyledAvatar
                                                src={`https://d3sog3sqr61u3b.cloudfront.net/${selectedGirl.picture}`}
                                                alt={selectedGirl.username}
                                            />
                                            <Typography variant="h4" sx={{ color: 'white', marginTop: 2 }}>
                                                {selectedGirl.username}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white', marginTop: 1 }}>
                                                Age: {selectedGirl.age}, Country: {selectedGirl.country}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'white', marginTop: 1 }}>
                                                {selectedGirl.bio}
                                            </Typography>
                                            <GradientButton onClick={handleDeleteGirl}>
                                                Delete Girl
                                            </GradientButton>

                                            <GradientButton onClick={handleCreateTweet}>
                                                Create Tweet
                                            </GradientButton>
                                        </Box>

                                        {/* Posts List */}
                                        <Typography variant="h5" gutterBottom sx={{ color: 'white', marginBottom: 2 }}>
                                            Posts
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {selectedGirl.posts && selectedGirl.posts.length > 0 ? (
                                                selectedGirl.posts.map(post => (
                                                    <Grid item xs={12} key={post.id}>
                                                        <Card sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                                                            {/* Assuming you have a Post component */}
                                                            {/* <Post data={post} /> */}
                                                            <GirlPostsComp
                                                                girl={post.girlId}
                                                                user={user}
                                                                post={post}
                                                            />
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleDeletePost(post.id)}
                                                                sx={{ marginTop: 1 }}
                                                            >
                                                                Delete Post
                                                            </Button>
                                                        </Card>
                                                    </Grid>
                                                ))
                                            ) : (
                                                <Typography variant="body1" sx={{ color: 'white' }}>
                                                    No posts available.
                                                </Typography>
                                            )}
                                        </Grid>

                                        {/* Posts List */}
                                        <Typography variant="h5" gutterBottom sx={{ color: 'white', marginBottom: 2, marginTop:5 }}>
                                            Pictures for Chat
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {selectedGirl.pictures && selectedGirl.pictures.length > 0 ? (
                                                selectedGirl.pictures.map(post => (
                                                    <Grid item xs={12} key={post.id}>
                                                        <Card sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                                                            {/* Assuming you have a Post component */}
                                                            {/* <Post data={post} /> */}
                                                            <MediaWrapper>
                                                                {post.image ? (
                                                                    <>
                                                                        <PostImage
                                                                            src={`https://d3sog3sqr61u3b.cloudfront.net/${post.image}`}
                                                                            alt={`Post ${post.id}`}
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
                                                            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                                                {post.description}
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                                                Premium: {post.isPremium?'premium':'free'}
                                                            </Typography>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleDeletePicture(post.id)}
                                                                sx={{ marginTop: 1 }}
                                                            >
                                                                Delete Picture
                                                            </Button>
                                                        </Card>
                                                    </Grid>
                                                ))
                                            ) : (
                                                <Grid item xs={12} key='9879'>
                                                    <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
                                                        No pictures available.
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>


                                        {/* Posts List */}
                                        <Typography variant="h5" gutterBottom sx={{ color: 'white', marginBottom: 2, marginTop:5 }}>
                                            Videos for Chat
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {selectedGirl.videos && selectedGirl.videos.length > 0 ? (
                                                selectedGirl.videos.map(post => (
                                                    <Grid item xs={12} key={post.id}>
                                                        <Card sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                                                            {/* Assuming you have a Post component */}
                                                            {/* <Post data={post} /> */}
                                                            <MediaWrapper>
                                                                {post.image ? (
                                                                    <>
                                                                        <PostImage
                                                                            src={`https://d3sog3sqr61u3b.cloudfront.net/${post.image}`}
                                                                            alt={`Post ${post.id}`}
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
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleDeleteVideo(post.id)}
                                                                sx={{ marginTop: 1 }}
                                                            >
                                                                Delete Picture
                                                            </Button>
                                                        </Card>
                                                    </Grid>
                                                ))
                                            ) : (
                                                <Grid item xs={12} key='9879'>
                                                    <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
                                                        No pictures available.
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </>
                                )}
                            </GlassCard>
                        ) : (
                            <GlassCard elevation={4}>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    Please select a girl from the list to view her details.
                                </Typography>
                            </GlassCard>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ManageGirlPosts;
