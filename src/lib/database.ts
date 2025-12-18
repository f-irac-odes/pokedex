// Mock database - in production this would be a real database
export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    avatar: string;
    coverImage: string;
    followers: number;
    following: number;
    posts: number;
    joinedDate: string;
    website?: string;
    location?: string;
    isVerified: boolean;
    isFollowing?: boolean;
}

export interface Post {
    id: string;
    userId: string;
    user: User;
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    isLiked: boolean;
}

// Mock users data
export const users: User[] = [
    {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        bio: 'Frontend developer passionate about creating beautiful and functional web applications.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
        followers: 1234,
        following: 567,
        posts: 89,
        joinedDate: 'March 2022',
        website: 'https://johndoe.dev',
        location: 'San Francisco, CA',
        isVerified: true,
        isFollowing: false
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        username: 'sarahj',
        email: 'sarah@example.com',
        bio: 'UI/UX Designer creating delightful digital experiences ✨',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
        followers: 892,
        following: 423,
        posts: 156,
        joinedDate: 'January 2021',
        website: 'https://sarahdesigns.com',
        location: 'New York, NY',
        isVerified: false,
        isFollowing: true
    },
    {
        id: '3',
        name: 'Mike Chen',
        username: 'mikechen',
        email: 'mike@example.com',
        bio: 'Full-stack developer and coffee enthusiast ☕',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
        followers: 2156,
        following: 789,
        posts: 234,
        joinedDate: 'September 2020',
        website: 'https://mikechen.dev',
        location: 'Austin, TX',
        isVerified: true,
        isFollowing: false
    },
    {
        id: '4',
        name: 'Emma Wilson',
        username: 'emmaw',
        email: 'emma@example.com',
        bio: 'AI researcher exploring the future of technology 🤖',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
        followers: 3421,
        following: 234,
        posts: 67,
        joinedDate: 'June 2023',
        location: 'London, UK',
        isVerified: true,
        isFollowing: false
    }
];

// Mock posts data
export const posts: Post[] = [
    {
        id: '1',
        userId: '2',
        user: users[1],
        content: 'Just finished building my first SvelteKit app! 🚀 The developer experience is amazing.',
        timestamp: '2 hours ago',
        likes: 23,
        comments: 5,
        isLiked: false
    },
    {
        id: '2',
        userId: '3',
        user: users[2],
        content: 'Beautiful sunset from my morning hike yesterday. Nature never fails to amaze me! 🌅',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        timestamp: '4 hours ago',
        likes: 47,
        comments: 12,
        isLiked: true
    },
    {
        id: '3',
        userId: '4',
        user: users[3],
        content: 'Working on a new project that combines AI with web development. Excited to share more details soon! 🤖✨',
        timestamp: '1 day ago',
        likes: 89,
        comments: 18,
        isLiked: false
    },
    {
        id: '4',
        userId: '1',
        user: users[0],
        content: 'Just deployed my new SvelteKit project! The performance improvements with Svelte 5 are incredible. 🚀',
        timestamp: '2 hours ago',
        likes: 47,
        comments: 12,
        isLiked: true
    },
    {
        id: '5',
        userId: '1',
        user: users[0],
        content: 'Working on some exciting new features for my portfolio. Can\'t wait to share them! 🎨',
        timestamp: '1 day ago',
        likes: 23,
        comments: 5,
        isLiked: false,
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
    }
];

// In-memory storage for likes and follows (in production, use a real database)
const likedPosts = new Set<string>();
const userFollows = new Map<string, Set<string>>();

// Helper functions
export function getUserById(id: string): User | undefined {
    return users.find(user => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
    return users.find(user => user.email === email);
}

export function getPostsByUserId(userId: string): Post[] {
    return posts.filter(post => post.userId === userId);
}

export function getAllPosts(): Post[] {
    return posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function togglePostLike(postId: string, userId: string): { liked: boolean; likes: number } {
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const likeKey = `${postId}_${userId}`;
    
    if (likedPosts.has(likeKey)) {
        likedPosts.delete(likeKey);
        post.likes = Math.max(0, post.likes - 1);
        return { liked: false, likes: post.likes };
    } else {
        likedPosts.add(likeKey);
        post.likes += 1;
        return { liked: true, likes: post.likes };
    }
}

export function toggleUserFollow(followerId: string, followedId: string): { following: boolean; followers: number } {
    const follower = getUserById(followerId);
    const followed = getUserById(followedId);
    
    if (!follower || !followed) throw new Error('User not found');
    
    let followSet = userFollows.get(followerId);
    if (!followSet) {
        followSet = new Set();
        userFollows.set(followerId, followSet);
    }
    
    if (followSet.has(followedId)) {
        followSet.delete(followedId);
        followed.followers = Math.max(0, followed.followers - 1);
        follower.following = Math.max(0, follower.following - 1);
        return { following: false, followers: followed.followers };
    } else {
        followSet.add(followedId);
        followed.followers += 1;
        follower.following += 1;
        return { following: true, followers: followed.followers };
    }
}

export function createPost(userId: string, content: string, image?: string): Post {
    const user = getUserById(userId);
    if (!user) throw new Error('User not found');

    const newPost: Post = {
        id: Date.now().toString(),
        userId,
        user,
        content,
        image,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        isLiked: false
    };

    posts.unshift(newPost);
    user.posts += 1;
    
    return newPost;
}