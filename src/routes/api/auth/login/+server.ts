import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserByEmail, type User } from '$lib/database';

// Mock user session storage (in production, use proper session management)
let sessions = new Map<string, { userId: string; email: string; createdAt: Date }>();

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = getUserByEmail(email);
        if (!user) {
            return json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // In a real app, you would verify the password hash here
        // For demo purposes, we'll accept any password

        // Create session
        const sessionId = crypto.randomUUID();
        sessions.set(sessionId, {
            userId: user.id,
            email: user.email,
            createdAt: new Date()
        });

        // Set session cookie
        cookies.set('session', sessionId, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        // Return user data (without sensitive info)
        const { password: _, ...userWithoutPassword } = user;
        
        return json({
            success: true,
            data: {
                user: userWithoutPassword,
                message: 'Login successful'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
    try {
        const sessionId = cookies.get('session');
        
        if (sessionId) {
            sessions.delete(sessionId);
        }

        // Clear session cookie
        cookies.delete('session', { path: '/' });

        return json({
            success: true,
            data: { message: 'Logout successful' }
        });
    } catch (error) {
        console.error('Logout error:', error);
        return json(
            { success: false, error: 'Logout failed' },
            { status: 500 }
        );
    }
};

// Export session management functions
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