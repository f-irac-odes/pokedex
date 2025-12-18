import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '../utils';
import { getMediaForTrade, purchaseMedia, downloadMedia } from '$lib/database';

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        const user = getCurrentUser(cookies);
        
        // Allow access for both authenticated and guest users
        const mediaForTrade = getMediaForTrade();

        return json({
            success: true,
            data: { media: mediaForTrade, user }
        });
    } catch (error) {
        console.error('Get trading media error:', error);
        return json(
            { success: false, error: 'Failed to fetch trading media' },
            { status: 500 }
        );
    }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const user = getCurrentUser(cookies);
        
        if (!user) {
            return json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { postId } = await request.json();

        if (!postId) {
            return json(
                { success: false, error: 'Post ID is required' },
                { status: 400 }
            );
        }

        const success = purchaseMedia(postId, user.id);

        if (!success) {
            return json(
                { success: false, error: 'Purchase failed. Check your credits or post availability.' },
                { status: 400 }
            );
        }

        return json({
            success: true,
            data: { 
                message: 'Media purchased successfully!',
                updatedUser: user,
                downloadUrl: `/api/media/download/${postId}`
            }
        });
    } catch (error) {
        console.error('Purchase media error:', error);
        return json(
            { success: false, error: 'Failed to purchase media' },
            { status: 500 }
        );
    }
};