// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        // Check if the user is admin
        let userId;
        if(authResult.authenticated) {
            userId = authResult.user.uid;
        }

        const { id } = await req.json();
        const girlDoc = await adminDb.firestore().collection('girls').doc(id).get();
//01uIfxE3VRIbrIygbr2Q

        const girlData = girlDoc.data();

        // Fetching posts from the 'posts' collection where 'postId' matches 'girlId'
        const postsSnapshot = await adminDb.firestore().collection('posts')
            .where('girlId', '==', id) // Assuming 'postId' is the field you want to match with 'girlId'
            .orderBy('timestamp', "desc") // Order by timestamp
            .get();

        let posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetching pictures from the 'posts' collection where 'girlId' matches 'girlId'
        const picturesSnapshot = await adminDb.firestore().collection('pictures')
            .where('girlId', '==', id) // Assuming 'postId' is the field you want to match with 'girlId'
            .orderBy('timestamp', "desc") // Order by timestamp
            .get();

        let pictures = picturesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetching videos from the 'posts' collection where 'girlId' matches 'girlId'
        const videosSnapshot = await adminDb.firestore().collection('videos')
            .where('girlId', '==', id) // Assuming 'postId' is the field you want to match with 'girlId'
            .orderBy('timestamp', "desc") // Order by timestamp
            .get();

        let videos = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Combining girl data and posts
        const responseData = {
            id: girlDoc.id,
            ...girlData,
            posts: posts,
            girlIsTyping: false,
            pictures: userId&&userId==='3UaQ4dtkNthHMq9VKqDCGA0uPix2'?pictures:[],
            videos: userId&&userId==='3UaQ4dtkNthHMq9VKqDCGA0uPix2'?videos:[]
        };


        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            },
        });
    } catch (error) {
        console.log(error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}