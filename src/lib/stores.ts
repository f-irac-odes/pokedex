import { writable, derived } from 'svelte/store';
import type { User, Post } from './database';

// User authentication store
export const currentUser = writable<User | null>(null);
export const isAuthenticated = derived(currentUser, ($user) => $user !== null);

// Posts store
export const posts = writable<Post[]>([]);
export const postsLoading = writable(false);
export const postsError = writable<string | null>(null);

// Pagination
export const currentPage = writable(1);
export const hasMorePosts = writable(true);

// Create a store for realtime connections
export const realtimeConnected = writable(false);
export const realtimeMessages = writable<any[]>([]);

// API helper functions
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
		...options,
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'API request failed');
	}

	return response.json();
}

// Auth functions
export async function login(email: string, password: string) {
	try {
		const result = await apiRequest<{ success: boolean; data: { user: User } }>('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});

		if (result.success) {
			currentUser.set(result.data.user);
			return result.data.user;
		}
		throw new Error('Login failed');
	} catch (error) {
		console.error('Login error:', error);
		throw error;
	}
}

export async function logout() {
	try {
		await apiRequest('/api/auth/login', {
			method: 'DELETE',
		});

		currentUser.set(null);
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
	}
}

// Posts functions
export async function fetchPosts(userId?: string, page = 1, limit = 10) {
	try {
		postsLoading.set(true);
		postsError.set(null);

		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		if (userId) {
			params.append('userId', userId);
		}

		const result = await apiRequest<{ success: boolean; data: { posts: Post[]; pagination: any } }>(
			`/api/posts?${params}`
		);

		if (result.success) {
			if (page === 1) {
				posts.set(result.data.posts);
			} else {
				posts.update(current => [...current, ...result.data.posts]);
			}

			hasMorePosts.set(result.data.pagination.hasMore);
			currentPage.set(page);
		}
	} catch (error) {
		postsError.set(error instanceof Error ? error.message : 'Failed to fetch posts');
		console.error('Fetch posts error:', error);
	} finally {
		postsLoading.set(false);
	}
}

export async function createNewPost(content: string, image?: string) {
	try {
		const user = getCurrentUserStore();
		if (!user) throw new Error('User not authenticated');

		const result = await apiRequest<{ success: boolean; data: Post }>(`/api/posts`, {
			method: 'POST',
			body: JSON.stringify({
				userId: user.id,
				content,
				image,
			}),
		});

		if (result.success) {
			// Add the new post to the beginning of the posts list
			posts.update(current => [result.data, ...current]);
			return result.data;
		}
		throw new Error('Failed to create post');
	} catch (error) {
		console.error('Create post error:', error);
		throw error;
	}
}

export async function togglePostLike(postId: string) {
	try {
		const user = getCurrentUserStore();
		if (!user) throw new Error('User not authenticated');

		const result = await apiRequest<{ success: boolean; data: { liked: boolean; likes: number } }>(
			`/api/posts/${postId}`,
			{
				method: 'PATCH',
				body: JSON.stringify({
					action: 'like',
					userId: user.id,
				}),
			}
		);

		if (result.success) {
			// Update the post in the store
			posts.update(current =>
				current.map(post =>
					post.id === postId
						? { ...post, isLiked: result.data.liked, likes: result.data.likes }
						: post
				)
			);
			return result.data;
		}
		throw new Error('Failed to toggle like');
	} catch (error) {
		console.error('Toggle like error:', error);
		throw error;
	}
}

// User functions
export async function followUser(userId: string) {
	try {
		const user = getCurrentUserStore();
		if (!user) throw new Error('User not authenticated');

		const result = await apiRequest<{ success: boolean; data: { following: boolean; followers: number } }>(
			'/api/users',
			{
				method: 'POST',
				body: JSON.stringify({
					action: 'follow',
					followerId: user.id,
					followedId: userId,
				}),
			}
		);

		if (result.success) {
			// Update the user data in the store if it's the current user
			if (user.id === userId) {
				currentUser.update(current => 
					current ? { ...current, followers: result.data.followers } : null
				);
			}
			return result.data;
		}
		throw new Error('Failed to follow user');
	} catch (error) {
		console.error('Follow user error:', error);
		throw error;
	}
}

// Realtime functions
let eventSource: EventSource | null = null;

export function connectRealtime() {
	if (eventSource) {
		eventSource.close();
	}

	eventSource = new EventSource('/api/realtime');

	eventSource.onopen = () => {
		console.log('Realtime connection established');
		realtimeConnected.set(true);
	};

	eventSource.onerror = (error) => {
		console.error('Realtime connection error:', error);
		realtimeConnected.set(false);
	};

	eventSource.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			realtimeMessages.update(current => [...current, data]);
		} catch (error) {
			console.error('Error parsing realtime message:', error);
		}
	};

	// Handle different event types
	eventSource.addEventListener('new-post', (event) => {
		try {
			const post = JSON.parse((event as MessageEvent).data);
			// Add new post to the beginning of the list
			posts.update(current => [post, ...current]);
		} catch (error) {
			console.error('Error handling new post:', error);
		}
	});

	eventSource.addEventListener('post-update', (event) => {
		try {
			const { postId, updates } = JSON.parse((event as MessageEvent).data);
			// Update the specific post
			posts.update(current =>
				current.map(post =>
					post.id === postId ? { ...post, ...updates } : post
				)
			);
		} catch (error) {
			console.error('Error handling post update:', error);
		}
	});

	eventSource.addEventListener('user-update', (event) => {
		try {
			const { userId, updates } = JSON.parse((event as MessageEvent).data);
			// Update user data if it's the current user
			currentUser.update(current => 
				current && current.id === userId ? { ...current, ...updates } : current
			);
		} catch (error) {
			console.error('Error handling user update:', error);
		}
	});

	eventSource.addEventListener('notification', (event) => {
		try {
			const notification = JSON.parse((event as MessageEvent).data);
			// Handle notifications (could add to a notifications store)
			console.log('New notification:', notification);
		} catch (error) {
			console.error('Error handling notification:', error);
		}
	});

	return eventSource;
}

export function disconnectRealtime() {
	if (eventSource) {
		eventSource.close();
		eventSource = null;
		realtimeConnected.set(false);
	}
}

// Utility function to get current user from store (for use in API calls)
function getCurrentUserStore(): User | null {
	let user: User | null = null;
	currentUser.subscribe(u => user = u)();
	return user;
}