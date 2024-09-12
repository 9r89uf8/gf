// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export async function GET() {
    try {
        const girlDoc = await adminDb.firestore().collection('girls').doc('01uIfxE3VRIbrIygbr2Q').get();


        const girlData = girlDoc.data();

        // Fetching posts from the 'posts' collection where 'postId' matches 'girlId'
        const postsSnapshot = await adminDb.firestore().collection('posts')
            .where('girlId', '==', '01uIfxE3VRIbrIygbr2Q') // Assuming 'postId' is the field you want to match with 'girlId'
            .orderBy('timestamp', "desc") // Order by timestamp
            .get();

        let posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Combining girl data and posts
        const responseData = {
            id: girlDoc.id,
            ...girlData,
            posts: posts
        };


        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}