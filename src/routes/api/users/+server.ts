import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { 
	users, 
	getUserById, 
	getUserByEmail,
	getPostsByUserId,
	toggleUserFollow
} from '$lib/database';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const userId = url.searchParams.get('userId');
		const email = url.searchParams.get('email');
		const username = url.searchParams.get('username');

		let result;

		if (userId) {
			result = getUserById(userId);
		} else if (email) {
			result = getUserByEmail(email);
		} else if (username) {
			result = users.find(user => user.username === username);
		} else {
			// Return all users
			result = users;
		}

		if (!result) {
			return json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		return json({
			success: true,
			data: result
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		return json(
			{ success: false, error: 'Failed to fetch users' },
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { action, followerId, followedId } = await request.json();

		if (!action || !followerId || !followedId) {
			return json(
				{ success: false, error: 'Action, follower ID, and followed ID are required' },
				{ status: 400 }
			);
		}

		if (action === 'follow') {
			const result = toggleUserFollow(followerId, followedId);
			
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
		console.error('Error updating user:', error);
		return json(
			{ success: false, error: 'Failed to update user' },
			{ status: 500 }
		);
	}
};