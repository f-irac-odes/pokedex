import { getUserByEmail, type User } from '$lib/database';

// Mock user session storage (in production, use proper session management)
let sessions = new Map<string, { userId: string; email: string; createdAt: Date }>();

// In-memory connections for SSE
let _connections = new Set<ReadableStreamDefaultController>();

export function setConnections(connections: Set<ReadableStreamDefaultController>) {
    _connections = connections;
}

export function getCurrentUser(cookies: any): User | null {
    const sessionId = cookies.get('session');
    if (!sessionId) return null;

    const session = sessions.get(sessionId);
    if (!session) return null;
    
    const user = getUserByEmail(session.email);
    return user || null;
}

export function isAuthenticated(cookies: any): boolean {
    return getCurrentUser(cookies) !== null;
}

export function createSession(user: User, cookies: any): void {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, {
        userId: user.id,
        email: user.email,
        createdAt: new Date()
    });

    cookies.set('session', sessionId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });
}

export function destroySession(cookies: any): void {
    const sessionId = cookies.get('session');
    
    if (sessionId) {
        sessions.delete(sessionId);
    }

    cookies.delete('session', { path: '/' });
}

function broadcast(event: string, data: any) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    
    for (const controller of _connections) {
        try {
            controller.enqueue(new TextEncoder().encode(message));
        } catch (error) {
            console.error('Error broadcasting to connection:', error);
            _connections.delete(controller);
        }
    }
}

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
