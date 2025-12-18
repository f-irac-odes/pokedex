import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { 
    createPost, 
    getUserById, 
    togglePostLike,
    posts
} from '$lib/database';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const post = posts.find(p => p.id === params.id);
        if (!post) {
            return json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        return json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return json(
            { success: false, error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
};

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const { userId, content, image } = await request.json();

        if (!userId || !content) {
            return json(
                { success: false, error: 'User ID and content are required' },
                { status: 400 }
            );
        }

        const user = getUserById(userId);
        if (!user) {
            return json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const newPost = createPost(userId, content, image);

        return json({
            success: true,
            data: newPost
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return json(
            { success: false, error: 'Failed to create post' },
            { status: 500 }
        );
    }
};

export const PATCH: RequestHandler = async ({ request, params }) => {
    try {
        const { action, userId } = await request.json();

        if (!action || !userId) {
            return json(
                { success: false, error: 'Action and user ID are required' },
                { status: 400 }
            );
        }

        const postId = params.id;

        if (action === 'like') {
            const result = togglePostLike(postId, userId);
            
            return json({
                success: true,
                data: result
            });
        } else {
            return json(
                { success: false, error: 'Invalid action' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error updating post:', error);
        return json(
            { success: false, error: 'Failed to update post' },
            { status: 500 }
        );
    }
};