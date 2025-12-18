import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '../../utils';

export const GET: RequestHandler = async ({ cookies }) => {
    try {
        const user = getCurrentUser(cookies);
        
        if (!user) {
            return json({
                success: true,
                data: { user: null, isAuthenticated: false }
            });
        }

        return json({
            success: true,
            data: { user, isAuthenticated: true }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return json(
            { success: false, error: 'Failed to get current user' },
            { status: 500 }
        );
    }
};