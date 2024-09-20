// app/middleware/authMiddleware.js
import { adminAuth } from '@/app/utils/firebaseAdmin';
import { cookies } from 'next/headers';

export const authMiddleware = async (req) => {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        console.log('No token found');
        return { authenticated: false, error: 'No token found' };
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        req.user = decodedToken;
        return { authenticated: true, user: decodedToken };
    } catch (error) {
        console.error('Invalid token:', error);
        return { authenticated: false, error: 'Invalid token' };
    }
};


