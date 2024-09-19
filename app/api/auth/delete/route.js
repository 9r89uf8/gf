// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import {authMiddleware} from "@/app/middleware/authMiddleware";

export async function GET(req) {
    await authMiddleware(req);
    const id = req.user.uid;
    try {

        // Delete the user's authentication record
        await adminDb.auth().deleteUser(id);

        // Delete the user's document from Firestore
        await adminDb.firestore().collection('users').doc(id).delete();
        let user = {}
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log(error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}