import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '../auth/login/+server';
import { downloadMedia } from '$lib/database';

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const user = getCurrentUser(cookies);
		const postId = params.postId;
		
		if (!postId) {
			return json(
				{ success: false, error: 'Post ID is required' },
				{ status: 400 }
			);
		}

		// Track download
		downloadMedia(postId);

		// In a real implementation, you would return the actual media file
		// For now, return a mock response indicating successful download
		return json({
			success: true,
			data: { 
				message: 'Download initiated',
				postId,
				user
			}
		});
	} catch (error) {
		console.error('Download media error:', error);
		return json(
			{ success: false, error: 'Failed to download media' },
			{ status: 500 }
		);
	}
};