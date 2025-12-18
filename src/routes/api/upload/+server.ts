import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '../utils';
import { createPost } from '$lib/database';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const user = getCurrentUser(cookies);
        
        if (!user) {
            return json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { content, image, video, price, isForTrade } = await request.json();

        if (!content || (!image && !video)) {
            return json(
                { success: false, error: 'Content and media are required' },
                { status: 400 }
            );
        }

        // Create the post with media
        const newPost = createPost(user.id, content, image, video, price, isForTrade);

        return json({
            success: true,
            data: { post: newPost }
        });
    } catch (error) {
        console.error('Upload media error:', error);
        return json(
            { success: false, error: 'Failed to upload media' },
            { status: 500 }
        );
    }
};