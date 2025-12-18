import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllPosts, getUserById } from '$lib/database';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const userId = url.searchParams.get('userId');
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');

		let posts = getAllPosts();

		// Filter by user if specified
		if (userId) {
			posts = posts.filter(post => post.userId === userId);
		}

		// Pagination
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedPosts = posts.slice(startIndex, endIndex);

		return json({
			success: true,
			data: {
				posts: paginatedPosts,
				pagination: {
					page,
					limit,
					total: posts.length,
					hasMore: endIndex < posts.length
				}
			}
		});
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json(
			{ success: false, error: 'Failed to fetch posts' },
			{ status: 500 }
		);
	}
};