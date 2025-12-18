<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { currentUser } from '$lib/stores';
    import type { Post } from '$lib/database';

    let posts = $state<Post[]>([]);
    let loading = $state(false);
    let error = $state<string | null>(null);
    let user = $state<any>(null);
    let filter = $state<'all' | 'for-trade' | 'free'>('for-trade');

    // Subscribe to current user
    onMount(() => {
        const unsubscribe = currentUser.subscribe(u => user = u);
        return unsubscribe;
    });

    onMount(async () => {
        await fetchPosts();
    });

    async function fetchPosts() {
        try {
            loading = true;
            const response = await fetch('/api/posts');
            const result = await response.json();
            
            if (result.success) {
                let filteredPosts = result.data.posts;
                
                // Filter based on selection
                if (filter === 'for-trade') {
                    filteredPosts = filteredPosts.filter((p: Post) => p.isForTrade);
                } else if (filter === 'free') {
                    filteredPosts = filteredPosts.filter((p: Post) => !p.isForTrade);
                }
                
                posts = filteredPosts;
            }
        } catch (err) {
            error = 'Failed to load posts';
        } finally {
            loading = false;
        }
    }

    async function purchaseMedia(post: Post) {
        if (!user) {
            goto('/login');
            return;
        }

        if (user.credits < post.price!) {
            alert('Insufficient credits!');
            return;
        }

        try {
            const response = await fetch('/api/trading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: post.id })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Media purchased successfully!');
                await fetchPosts(); // Refresh to update credits
                // Update local user state
                currentUser.set(result.data.updatedUser);
            } else {
                alert(result.error || 'Purchase failed');
            }
        } catch (err) {
            alert('Purchase failed');
        }
    }

    function downloadFreeMedia(post: Post) {
        if (!post.image && !post.video) return;
        
        // In a real app, this would download the actual file
        window.open(post.image || post.video, '_blank');
        
        // Track download
        fetch(`/api/media/download/${post.id}`, { method: 'GET' });
    }

    function formatPrice(price: number | undefined) {
        if (!price) return 'Free';
        return `${price} credits`;
    }

    function getMediaTypeIcon(mediaType: string) {
        switch (mediaType) {
            case 'video': return '🎥';
            case 'image': return '🖼️';
            default: return '📝';
        }
    }

    // React to filter changes - fetch posts when filter changes
    $effect.root(() => {
        fetchPosts();
    });
</script>

<svelte:head>
    <title>MemeLand Marketplace - Collect & Trade Memes</title>
    <meta name="description" content="Browse and trade amazing memes and content on MemeLand" />
</svelte:head>

<div class="marketplace-container">
    <div class="marketplace-header">
        <h1>🎪 MemeLand Marketplace</h1>
        <p>Everything here is available to collect and trade! 🎉</p>
        
        {#if !user}
            <div class="guest-notice">
                <span>🔍 Browsing as guest -</span>
                <a href="/login">Sign in to trade</a>
            </div>
        {/if}
    </div>

    <div class="filter-tabs">
        <button 
            class:active={filter === 'for-trade'} 
            on:click={() => filter = 'for-trade'}
        >
            💰 For Trade
        </button>
        <button 
            class:active={filter === 'free'} 
            on:click={() => filter = 'free'}
        >
            🆓 Free Content
        </button>
        <button 
            class:active={filter === 'all'} 
            on:click={() => filter = 'all'}
        >
            📋 All Media
        </button>
    </div>

    {#if loading}
        <div class="loading">Loading marketplace...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else if posts.length === 0}
        <div class="empty-state">
            <h3>No media found</h3>
            <p>Be the first to <a href="/login">upload content</a>!</p>
        </div>
    {:else}
        <div class="marketplace-grid">
            {#each posts as post (post.id)}
                <div class="media-card">
                    <div class="media-header">
                        <div class="creator-info">
                            <img src={post.user.avatar} alt={post.user.name} class="creator-avatar" />
                            <div class="creator-details">
                                <h4>{post.user.name}</h4>
                                <span class="username">@{post.user.username}</span>
                            </div>
                        </div>
                        <span class="media-type">{getMediaTypeIcon(post.mediaType)}</span>
                    </div>

                    <div class="media-content">
                        {#if post.image}
                            <img src={post.image} alt="Media content" class="media-thumbnail" />
                        {:else if post.video}
                            <video 
                                src={post.video} 
                                class="media-thumbnail" 
                                muted 
                                loop
                                preload="metadata"
                            ></video>
                        {/if}
                        
                        <p class="media-description">{post.content}</p>
                    </div>

                    <div class="media-stats">
                        <div class="stat-item">
                            <span>❤️ {post.likes}</span>
                        </div>
                        <div class="stat-item">
                            <span>👁️ {post.views || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span>📥 {post.downloads || 0}</span>
                        </div>
                    </div>

                    <div class="media-footer">
                        <div class="pricing">
                            {#if post.isForTrade}
                                <span class="price">{formatPrice(post.price)}</span>
                            {:else}
                                <span class="price free">Free</span>
                            {/if}
                        </div>

                        {#if post.isForTrade}
                            {#if user}
                                <button 
                                    class="buy-button"
                                    on:click={() => purchaseMedia(post)}
                                    disabled={!user || user.credits < post.price!}
                                >
                                    💰 Purchase
                                </button>
                            {:else}
                                <a href="/login" class="buy-button">Sign in to Buy</a>
                            {/if}
                        {:else}
                            <button 
                                class="download-button"
                                on:click={() => downloadFreeMedia(post)}
                            >
                                📥 Download
                            </button>
                        {/if}
                    </div>

                    {#if user && user.id === post.userId}
                        <div class="owner-badge">👑 Your Content</div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Outfit:wght@400;600;700;800&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .marketplace-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .marketplace-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .marketplace-header h1 {
        font-size: 3rem;
        margin-bottom: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
    }

    .marketplace-header p {
        color: #cbd5e1;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .guest-notice {
        margin-top: 20px;
        padding: 12px 24px;
        background: rgba(102, 126, 234, 0.15);
        border-radius: 20px;
        border: 1px solid rgba(102, 126, 234, 0.3);
        display: inline-block;
    }

    .guest-notice span {
        color: #a0aec0;
    }

    .guest-notice a {
        color: #667eea;
        text-decoration: none;
        font-weight: 700;
    }

    .filter-tabs {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }

    .filter-tabs button {
        padding: 12px 24px;
        border: 1px solid rgba(102, 126, 234, 0.3);
        background: rgba(102, 126, 234, 0.1);
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 700;
        color: #a0aec0;
        font-family: 'Fredoka', sans-serif;
        font-size: 14px;
    }

    .filter-tabs button.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-color: transparent;
    }

    .filter-tabs button:hover:not(.active) {
        border-color: rgba(102, 126, 234, 0.6);
        color: #e0e7ff;
        background: rgba(102, 126, 234, 0.2);
    }

    .loading, .error, .empty-state {
        text-align: center;
        padding: 60px 40px;
        color: #a0aec0;
        font-size: 18px;
        font-weight: 600;
    }

    .error {
        color: #ff6b6b;
    }

    .marketplace-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
        auto-rows: max-content;
    }

    @supports (grid-auto-rows: masonry) {
        .marketplace-grid {
            grid-auto-rows: masonry;
        }
    }

    .media-card {
        background: rgba(102, 126, 234, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .media-card:hover {
        transform: translateY(-8px);
        border-color: rgba(102, 126, 234, 0.6);
        box-shadow: 0 12px 48px rgba(102, 126, 234, 0.3);
    }

    .media-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid rgba(102, 126, 234, 0.2);
    }

    .creator-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }

    .creator-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(102, 126, 234, 0.5);
    }

    .creator-details h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: #e0e7ff;
    }

    .username {
        font-size: 12px;
        color: #a0aec0;
        font-weight: 500;
    }

    .media-type {
        font-size: 20px;
    }

    .media-content {
        padding: 16px;
        flex: 1;
        position: relative;
        height: 220px;
        overflow: hidden;
    }

    .media-thumbnail {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 12px;
    }

    .media-description {
        font-size: 14px;
        color: #cbd5e1;
        line-height: 1.4;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .media-stats {
        display: flex;
        justify-content: space-around;
        padding: 12px 16px;
        background: rgba(102, 126, 234, 0.15);
        border-top: 1px solid rgba(102, 126, 234, 0.2);
        border-bottom: 1px solid rgba(102, 126, 234, 0.2);
    }

    .stat-item {
        font-size: 13px;
        color: #a0aec0;
        font-weight: 600;
    }

    .media-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        gap: 12px;
    }

    .pricing {
        flex: 0 1 auto;
    }

    .price {
        font-weight: 700;
        font-size: 15px;
        color: #fbbf24;
        background: rgba(251, 191, 36, 0.1);
        padding: 4px 10px;
        border-radius: 8px;
        display: inline-block;
        border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .price.free {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
        border-color: rgba(102, 126, 234, 0.3);
    }

    .buy-button, .download-button {
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 700;
        text-decoration: none;
        text-align: center;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 13px;
        font-family: 'Fredoka', sans-serif;
        flex: 1;
        white-space: nowrap;
    }

    .buy-button {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }

    .buy-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .buy-button:disabled {
        background: rgba(102, 126, 234, 0.2);
        color: #6b7280;
        cursor: not-allowed;
        opacity: 0.6;
    }

    .download-button {
        background: rgba(102, 126, 234, 0.2);
        color: #a0aec0;
        border: 1px solid rgba(102, 126, 234, 0.3);
    }

    .download-button:hover {
        background: rgba(102, 126, 234, 0.3);
        border-color: rgba(102, 126, 234, 0.6);
    }

    .owner-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(102, 126, 234, 0.5);
    }

    @media (max-width: 768px) {
        .marketplace-grid {
            grid-template-columns: 1fr;
        }
        
        .filter-tabs {
            flex-wrap: wrap;
        }
        
        .media-footer {
            flex-direction: column;
            gap: 10px;
        }
    }
</style>