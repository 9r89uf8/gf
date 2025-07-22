import { Container, Box } from '@mui/material';
import { getPostsForSSR } from '@/app/api/v2/services/postsServerService';
import PostsClient from './PostsClient';

export default async function Posts() {
    // Fetch initial posts on the server
    const initialPosts = await getPostsForSSR(15, 0);

    return (
        <Box sx={{ minHeight: "100vh", padding: 2 }}>
            <Container maxWidth="md">
                <PostsClient initialPosts={initialPosts} />
            </Container>
        </Box>
    );
}

