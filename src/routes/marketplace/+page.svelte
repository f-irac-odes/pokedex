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

	// React to filter changes
	$: if (posts.length > 0) {
		fetchPosts();
	}
</script>

<svelte:head>
	<title>Memedex Marketplace - Trade & Share Media</title>
	<meta name="description" content="Browse and trade high-quality media content on Memedex" />
</svelte:head>

<div class="marketplace-container">
	<div class="marketplace-header">
		<h1>📈 Marketplace</h1>
		<p>Discover and trade amazing media content from our community</p>
		
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
	.marketplace-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.marketplace-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.marketplace-header h1 {
		font-size: 2.5rem;
		margin-bottom: 10px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.marketplace-header p {
		color: #666;
		font-size: 1.1rem;
	}

	.guest-notice {
		margin-top: 15px;
		padding: 10px 20px;
		background: #f8f9fa;
		border-radius: 20px;
		border: 1px solid #e1e5e9;
		display: inline-block;
	}

	.guest-notice span {
		color: #666;
	}

	.guest-notice a {
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
	}

	.filter-tabs {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 30px;
	}

	.filter-tabs button {
		padding: 10px 20px;
		border: 2px solid #e1e5e9;
		background: white;
		border-radius: 25px;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}

	.filter-tabs button.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.filter-tabs button:hover:not(.active) {
		border-color: #667eea;
		color: #667eea;
	}

	.loading, .error, .empty-state {
		text-align: center;
		padding: 40px;
		color: #666;
	}

	.error {
		color: #dc3545;
	}

	.marketplace-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 20px;
	}

	.media-card {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
		position: relative;
	}

	.media-card:hover {
		transform: translateY(-2px);
	}

	.media-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid #f0f0f0;
	}

	.creator-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.creator-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.creator-details h4 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
	}

	.username {
		font-size: 12px;
		color: #666;
	}

	.media-type {
		font-size: 20px;
	}

	.media-content {
		padding: 15px;
	}

	.media-thumbnail {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 8px;
		margin-bottom: 10px;
	}

	.media-description {
		font-size: 14px;
		color: #333;
		line-height: 1.4;
		margin: 0;
	}

	.media-stats {
		display: flex;
		justify-content: space-around;
		padding: 10px 15px;
		background: #f8f9fa;
		border-top: 1px solid #f0f0f0;
	}

	.stat-item {
		font-size: 12px;
		color: #666;
	}

	.media-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
	}

	.pricing {
		flex: 1;
	}

	.price {
		font-weight: 700;
		font-size: 16px;
		color: #28a745;
	}

	.price.free {
		color: #667eea;
	}

	.buy-button, .download-button {
		padding: 8px 16px;
		border-radius: 6px;
		font-weight: 600;
		text-decoration: none;
		text-align: center;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 14px;
	}

	.buy-button {
		background: #28a745;
		color: white;
	}

	.buy-button:hover:not(:disabled) {
		background: #218838;
	}

	.buy-button:disabled {
		background: #ccc;
		color: #666;
		cursor: not-allowed;
	}

	.download-button {
		background: #667eea;
		color: white;
	}

	.download-button:hover {
		background: #5a6fd8;
	}

	.owner-badge {
		position: absolute;
		top: 10px;
		right: 10px;
		background: rgba(102, 126, 234, 0.9);
		color: white;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
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