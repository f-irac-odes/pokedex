<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    import { 
        currentUser, 
        posts, 
        postsLoading,
        fetchPosts, 
        createNewPost, 
        togglePostLike, 
        logout,
        connectRealtime,
        disconnectRealtime,
        realtimeConnected 
    } from '$lib/stores';
    
    let newPostContent = $state('');
    let isCreatingPost = $state(false);
    let loading = $state(false);
    
    onMount(async () => {
        // Check if user is authenticated
        if (!$currentUser) {
            goto('/login');
            return;
        }
        
        // Fetch posts
        loading = true;
        await fetchPosts();
        loading = false;
        
        // Connect to realtime updates
        connectRealtime();
    });
    
    onDestroy(() => {
        disconnectRealtime();
    });
    
    function handleLogout() {
        logout().then(() => {
            goto('/login');
        }).catch(console.error);
    }
    
    function handleProfile() {
        goto('/profile');
    }
    
    async function createPost() {
        if (!newPostContent.trim()) return;
        
        isCreatingPost = true;
        
        try {
            await createNewPost(newPostContent);
            newPostContent = '';
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            isCreatingPost = false;
        }
    }
    
    async function handleToggleLike(postId: string) {
        try {
            await togglePostLike(postId);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }
    
    function formatTime(timestamp: string): string {
        return timestamp;
    }
</script>

<svelte:head>
    <title>Feed - Social App</title>
</svelte:head>

<div class="app">
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <h1 class="logo">SocialApp</h1>
            <div class="header-actions">
                <button class="icon-btn" title="Notifications">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </button>
                {#if $currentUser}
                    <button class="profile-btn" on:click={handleProfile} title="Profile">
                        <img src={$currentUser.avatar} alt={$currentUser.name} />
                    </button>
                {/if}
                <button class="icon-btn" on:click={handleLogout} title="Logout">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <!-- Create Post -->
            {#if $currentUser}
                <div class="create-post">
                    <div class="create-post-header">
                        <img src={$currentUser.avatar} alt={$currentUser.name} class="user-avatar" />
                        <textarea
                            bind:value={newPostContent}
                            placeholder="What's on your mind?"
                            class="post-input"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="create-post-actions">
                        <button class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21,15 16,10 5,21"></polyline>
                            </svg>
                            Photo
                        </button>
                        <button class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                            </svg>
                            Video
                        </button>
                        <button class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Feeling
                        </button>
                        <button 
                            class="post-btn" 
                            on:click={createPost} 
                            disabled={!newPostContent.trim() || isCreatingPost}
                        >
                            {isCreatingPost ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            {/if}

            <!-- Posts Feed -->
            <div class="posts">
                {#if loading}
                    <div class="loading">Loading posts...</div>
                {:else if $posts.length === 0}
                    <div class="no-posts">No posts yet. Be the first to post!</div>
                {:else}
                    {#each $posts as post (post.id)}
                    <article class="post">
                        <div class="post-header">
                            <img src={post.user.avatar} alt={post.user.name} class="post-avatar" />
                            <div class="post-user-info">
                                <h3 class="post-user-name">{post.user.name}</h3>
                                <p class="post-timestamp">{formatTime(post.timestamp)}</p>
                            </div>
                            <button class="more-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="12" cy="5" r="1"></circle>
                                    <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="post-content">
                            <p>{post.content}</p>
                            {#if post.image}
                                <img src={post.image} alt="Post image" class="post-image" />
                            {/if}
                        </div>
                        
                        <div class="post-actions">
                            <button 
                                class="action-button {post.isLiked ? 'liked' : ''}" 
                                on:click={() => handleToggleLike(post.id)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                {post.likes}
                            </button>
                            <button class="action-button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                {post.comments}
                            </button>
                            <button class="action-button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                                Share
                            </button>
                        </div>
                    </article>
                    {/each}
                {/if}
            </div>
        </div>
    </main>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .app {
        min-height: 100vh;
        background: #f5f5f5;
    }
    
    .header {
        background: white;
        border-bottom: 1px solid #e1e5e9;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .header-content {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
    }
    
    .logo {
        font-size: 24px;
        font-weight: 700;
        color: #667eea;
    }
    
    .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .icon-btn, .profile-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        color: #666;
        transition: background-color 0.2s;
    }
    
    .icon-btn:hover, .profile-btn:hover {
        background: #f0f0f0;
    }
    
    .profile-btn img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .main {
        padding: 20px 0;
    }
    
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .create-post {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .create-post-header {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
    }
    
    .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }
    
    .post-input {
        flex: 1;
        border: none;
        resize: none;
        font-size: 16px;
        font-family: inherit;
        padding: 12px;
        border-radius: 8px;
        background: #f5f5f5;
        outline: none;
    }
    
    .post-input:focus {
        background: #e8e8e8;
    }
    
    .create-post-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-top: 12px;
        border-top: 1px solid #e1e5e9;
    }
    
    .action-btn {
        background: none;
        border: none;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 6px;
        color: #666;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }
    
    .action-btn:hover {
        background: #f0f0f0;
    }
    
    .post-btn {
        margin-left: auto;
        background: #667eea;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .post-btn:hover:not(:disabled) {
        background: #5a67d8;
    }
    
    .post-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .posts {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .post {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .post-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }
    
    .post-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .post-user-info {
        flex: 1;
    }
    
    .post-user-name {
        font-weight: 600;
        color: #333;
        margin-bottom: 2px;
    }
    
    .post-timestamp {
        font-size: 14px;
        color: #666;
    }
    
    .more-btn {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
    }
    
    .more-btn:hover {
        background: #f0f0f0;
    }
    
    .post-content {
        margin-bottom: 16px;
    }
    
    .post-content p {
        line-height: 1.5;
        color: #333;
        margin-bottom: 12px;
    }
    
    .post-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
        object-fit: cover;
    }
    
    .post-actions {
        display: flex;
        align-items: center;
        gap: 32px;
        padding-top: 12px;
        border-top: 1px solid #e1e5e9;
    }
    
    .action-button {
        background: none;
        border: none;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 6px;
        color: #666;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }
    
    .action-button:hover {
        background: #f0f0f0;
    }
    
    .action-button.liked {
        color: #e0245e;
    }
    
    @media (max-width: 768px) {
        .container {
            padding: 0 16px;
        }
        
        .header-content {
            padding: 12px 16px;
        }
        
        .create-post-actions {
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .action-btn {
            flex: 1;
            min-width: 0;
        }
        
        .post-btn {
            flex: 1;
        }
        
        .post-actions {
            gap: 16px;
        }
    }
</style>