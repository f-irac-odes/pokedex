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
    let pricePerLike = $state(5);
    let pricePerComment = $state(10);
    
    onMount(async () => {
        loading = true;
        await fetchPosts();
        loading = false;
        
        if ($currentUser) {
            connectRealtime();
        }
    });
    
    onDestroy(() => {
        disconnectRealtime();
    });
    
    let user = $state<any>(null);
    $effect(() => {
        const unsubscribe = currentUser.subscribe(u => user = u);
        return unsubscribe;
    });
    
    function handleLogout() {
        logout().then(() => {
            goto('/');
        }).catch(console.error);
    }
    
    function handleProfile() {
        if (user) {
            goto(`/profile/${user.username}`);
        } else {
            goto('/login');
        }
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
    <title>MemeLand Feed - Collect & Trade</title>
</svelte:head>

<div class="app">
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <h1 class="logo">🎨 MemeLand Feed</h1>
            <div class="header-actions">
                {#if $currentUser}
                    <div class="credits-badge">
                        💰 {$currentUser.credits} credits
                    </div>
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
                            placeholder="Share an amazing meme or content! 🎨"
                            class="post-input"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="create-post-settings">
                        <div class="price-input">
                            <label>💰 Earn per like:</label>
                            <input type="number" bind:value={pricePerLike} min="1" max="100" />
                            <span>credits</span>
                        </div>
                        <div class="price-input">
                            <label>💬 Earn per comment:</label>
                            <input type="number" bind:value={pricePerComment} min="1" max="100" />
                            <span>credits</span>
                        </div>
                    </div>
                    <div class="create-post-actions">
                        <button class="action-btn">
                            <span>📷</span>
                            Photo
                        </button>
                        <button class="action-btn">
                            <span>🎬</span>
                            Video
                        </button>
                        <button class="action-btn">
                            <span>😂</span>
                            Meme
                        </button>
                        <button 
                            class="post-btn" 
                            on:click={createPost} 
                            disabled={!newPostContent.trim() || isCreatingPost}
                        >
                            {isCreatingPost ? '⏳ Posting...' : '🚀 Post to Marketplace'}
                        </button>
                    </div>
                </div>
            {/if}

            <!-- Posts Feed - Pinterest Grid -->
            <div class="posts-grid">
                {#if loading}
                    <div class="loading">Loading amazing content... ✨</div>
                {:else if $posts.length === 0}
                    <div class="no-posts">No posts yet. Be the first to create! 🎉</div>
                {:else}
                    {#each $posts as post (post.id)}
                    <article class="post-card">
                        <div class="post-image-wrapper">
                            {#if post.image}
                                <img src={post.image} alt="Post image" class="post-image" />
                            {:else if post.video}
                                <video src={post.video} class="post-image" muted loop preload="metadata"></video>
                            {:else}
                                <div class="post-placeholder">
                                    <div class="placeholder-emoji">🎨</div>
                                </div>
                            {/if}
                            <div class="post-overlay">
                                <div class="post-header-overlay">
                                    <img src={post.user.avatar} alt={post.user.name} class="post-avatar" />
                                    <div class="post-user-info">
                                        <h3 class="post-user-name">{post.user.name}</h3>
                                        <p class="post-timestamp">{formatTime(post.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="post-content">
                            <p>{post.content}</p>
                        </div>
                        
                        <div class="post-stats">
                            <div class="stat-badge">❤️ {post.likes}</div>
                            <div class="stat-badge">💬 {post.comments}</div>
                            <div class="stat-badge">👁️ {post.views || 0}</div>
                        </div>

                        <div class="post-pricing">
                            <span class="price-tag">💰 {post.pricePerLike} credits/like</span>
                            <span class="price-tag">💬 {post.pricePerComment} credits/comment</span>
                        </div>
                        
                        <div class="post-actions">
                            <button 
                                class="action-button {post.isLiked ? 'liked' : ''}" 
                                on:click={() => handleToggleLike(post.id)}
                                title="Like & Earn"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                Like
                            </button>
                            <button class="action-button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Comment
                            </button>
                            <button class="action-button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 2L11 13M22 2l-7 20-5-9-9-5 20-7z"></path>
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
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Outfit:wght@400;600;700;800&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .app {
        min-height: 100vh;
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a3f 50%, #2d1b3d 100%);
        font-family: 'Fredoka', sans-serif;
    }
    
    .header {
        background: rgba(15, 15, 35, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 2px solid rgba(102, 126, 234, 0.3);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .header-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
    }
    
    .logo {
        font-size: 28px;
        font-weight: 800;
        background: linear-gradient(135deg, #667eea, #f093fb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-family: 'Outfit', sans-serif;
    }
    
    .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .credits-badge {
        background: rgba(102, 126, 234, 0.2);
        border: 1px solid rgba(102, 126, 234, 0.5);
        color: #a0aec0;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
    }
    
    .icon-btn, .profile-btn {
        background: rgba(102, 126, 234, 0.1);
        border: 1px solid rgba(102, 126, 234, 0.3);
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        color: #a0aec0;
        transition: all 0.2s;
    }
    
    .icon-btn:hover, .profile-btn:hover {
        background: rgba(102, 126, 234, 0.2);
        border-color: rgba(102, 126, 234, 0.5);
    }
    
    .profile-btn img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .main {
        padding: 40px 20px;
    }
    
    .container {
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .create-post {
        background: rgba(102, 126, 234, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 40px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    .create-post-header {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
    }
    
    .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        border: 2px solid rgba(102, 126, 234, 0.5);
    }
    
    .post-input {
        flex: 1;
        border: 1px solid rgba(102, 126, 234, 0.3);
        resize: none;
        font-size: 16px;
        font-family: 'Fredoka', sans-serif;
        padding: 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        color: white;
        outline: none;
    }
    
    .post-input:focus {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(102, 126, 234, 0.5);
    }
    
    .post-input::placeholder {
        color: #6b7280;
    }

    .create-post-settings {
        display: flex;
        gap: 20px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(102, 126, 234, 0.2);
    }

    .price-input {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .price-input label {
        color: #a0aec0;
        font-size: 14px;
        font-weight: 600;
    }

    .price-input input {
        width: 60px;
        padding: 6px 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 6px;
        color: white;
        font-family: 'Fredoka', sans-serif;
        font-weight: 600;
        text-align: center;
    }

    .price-input input:focus {
        outline: none;
        border-color: rgba(102, 126, 234, 0.6);
        background: rgba(102, 126, 234, 0.1);
    }

    .price-input span {
        color: #6b7280;
        font-size: 14px;
    }
    
    .create-post-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .action-btn {
        background: rgba(102, 126, 234, 0.15);
        border: 1px solid rgba(102, 126, 234, 0.3);
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        border-radius: 8px;
        color: #a0aec0;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
        font-family: 'Fredoka', sans-serif;
    }
    
    .action-btn:hover {
        background: rgba(102, 126, 234, 0.25);
        border-color: rgba(102, 126, 234, 0.5);
    }

    .action-btn span {
        font-size: 16px;
    }
    
    .post-btn {
        margin-left: auto;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Fredoka', sans-serif;
    }
    
    .post-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    
    .post-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
        auto-rows: max-content;
    }

    @supports (grid-auto-rows: masonry) {
        .posts-grid {
            grid-auto-rows: masonry;
        }
    }
    
    .post-card {
        background: rgba(102, 126, 234, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .post-card:hover {
        transform: translateY(-8px);
        border-color: rgba(102, 126, 234, 0.6);
        box-shadow: 0 12px 48px rgba(102, 126, 234, 0.3);
    }

    .post-image-wrapper {
        position: relative;
        width: 100%;
        height: 250px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.2);
    }

    .post-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .post-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(240, 147, 251, 0.2));
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .placeholder-emoji {
        font-size: 64px;
        opacity: 0.5;
    }

    .post-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .post-card:hover .post-overlay {
        opacity: 1;
    }

    .post-header-overlay {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .post-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid white;
    }

    .post-user-info {
        flex: 1;
    }

    .post-user-name {
        font-weight: 700;
        color: white;
        margin-bottom: 2px;
        font-size: 14px;
    }

    .post-timestamp {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .post-content {
        padding: 16px;
        flex: 1;
    }
    
    .post-content p {
        line-height: 1.5;
        color: #cbd5e1;
        margin-bottom: 0;
        font-size: 14px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .post-stats {
        display: flex;
        gap: 8px;
        padding: 0 16px;
        flex-wrap: wrap;
    }

    .stat-badge {
        background: rgba(102, 126, 234, 0.2);
        border: 1px solid rgba(102, 126, 234, 0.3);
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        color: #a0aec0;
        font-weight: 600;
    }

    .post-pricing {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(102, 126, 234, 0.15);
        border-top: 1px solid rgba(102, 126, 234, 0.2);
        border-bottom: 1px solid rgba(102, 126, 234, 0.2);
        flex-wrap: wrap;
    }

    .price-tag {
        font-size: 12px;
        color: #fbbf24;
        font-weight: 700;
        background: rgba(251, 191, 36, 0.1);
        padding: 4px 10px;
        border-radius: 8px;
        border: 1px solid rgba(251, 191, 36, 0.3);
    }
    
    .post-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
    }
    
    .action-button {
        background: none;
        border: 1px solid rgba(102, 126, 234, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 8px 12px;
        border-radius: 8px;
        color: #a0aec0;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
        font-family: 'Fredoka', sans-serif;
        flex: 1;
    }
    
    .action-button:hover {
        background: rgba(102, 126, 234, 0.2);
        border-color: rgba(102, 126, 234, 0.5);
        color: #e0e7ff;
    }
    
    .action-button.liked {
        color: #ff006e;
        border-color: #ff006e;
        background: rgba(255, 0, 110, 0.1);
    }

    .action-button.liked:hover {
        background: rgba(255, 0, 110, 0.2);
    }

    .loading, .no-posts {
        text-align: center;
        padding: 60px 20px;
        color: #a0aec0;
        font-size: 18px;
        font-weight: 600;
    }

    .no-posts {
        font-size: 20px;
    }
    
    @media (max-width: 768px) {
        .container {
            padding: 0;
        }

        .header-content {
            padding: 12px 16px;
        }

        .logo {
            font-size: 20px;
        }

        .create-post-settings {
            flex-direction: column;
            gap: 12px;
        }

        .create-post-actions {
            flex-wrap: wrap;
        }

        .post-btn {
            margin-left: 0;
            width: 100%;
        }

        .posts-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        }

        .post-image-wrapper {
            height: 200px;
        }
    }
</style>
