import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { posts } from '$lib/database';

// In-memory connections for SSE
const connections = new Set<ReadableStreamDefaultController>();

function broadcast(event: string, data: any) {
	const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
	
	for (const controller of connections) {
		try {
			controller.enqueue(new TextEncoder().encode(message));
		} catch (error) {
			console.error('Error broadcasting to connection:', error);
			connections.delete(controller);
		}
	}
}

export const GET: RequestHandler = async ({ request, url }) => {
	// Create a readable stream for Server-Sent Events
	const stream = new ReadableStream({
		start(controller) {
			// Add this connection to our set
			connections.add(controller);

			// Send initial connection established message
			const welcomeMessage = `event: connected\ndata: ${JSON.stringify({ message: 'Connected to realtime updates' })}\n\n`;
			controller.enqueue(new TextEncoder().encode(welcomeMessage));

			// Send current posts count
			const statsMessage = `event: stats\ndata: ${JSON.stringify({ postsCount: posts.length })}\n\n`;
			controller.enqueue(new TextEncoder().encode(statsMessage));
		},

		cancel() {
			// Remove connection when client disconnects
			const controller = stream as any;
			connections.delete(controller);
		}
	});

	// Set up keep-alive ping
	const pingInterval = setInterval(() => {
		const pingMessage = `event: ping\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`;
		
		for (const controller of connections) {
			try {
				controller.enqueue(new TextEncoder().encode(pingMessage));
			} catch (error) {
				console.error('Error sending ping:', error);
				connections.delete(controller);
			}
		}
	}, 30000); // Ping every 30 seconds

	// Clean up interval when stream is closed
	const controller = stream as any;
	controller.closed?.then(() => {
		clearInterval(pingInterval);
		connections.delete(controller);
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Cache-Control'
		}
	});
};

// Helper functions to broadcast different types of events
export function broadcastNewPost(post: any) {
	broadcast('new-post', post);
}

export function broadcastPostUpdate(postId: string, updates: any) {
	broadcast('post-update', { postId, updates });
}

export function broadcastUserUpdate(userId: string, updates: any) {
	broadcast('user-update', { userId, updates });
}

export function broadcastNotification(notification: any) {
	broadcast('notification', notification);
}