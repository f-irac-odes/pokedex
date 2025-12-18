import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserByEmail } from '$lib/database';
import { createSession, destroySession } from '../../utils';

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
        createSession(user, cookies);

        // Return user data
        return json({
            success: true,
            data: {
                user,
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
        destroySession(cookies);

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