<script lang="ts">
	import { goto } from '$app/navigation';
	
	// Mock user data - in a real app, this would come from props, stores, or API
	let profileUser = $state({
		id: '1',
		name: 'John Doe',
		username: 'johndoe',
		email: 'john@example.com',
		bio: 'Frontend developer passionate about creating beautiful and functional web applications. Love working with Svelte and modern web technologies.',
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
		coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
		followers: 1234,
		following: 567,
		posts: 89,
		joinedDate: 'March 2022',
		website: 'https://johndoe.dev',
		location: 'San Francisco, CA',
		isVerified: true,
		isOwnProfile: true
	});
	
	// Mock user's posts
	let userPosts = $state([
		{
			id: '1',
			content: 'Just deployed my new SvelteKit project! The performance improvements with Svelte 5 are incredible. 🚀',
			timestamp: '2 hours ago',
			likes: 47,
			comments: 12,
			isLiked: true,
			image: null
		},
		{
			id: '2',
			content: 'Working on some exciting new features for my portfolio. Can\'t wait to share them! 🎨',
			timestamp: '1 day ago',
			likes: 23,
			comments: 5,
			isLiked: false,
			image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
		},
		{
			id: '3',
			content: 'Beautiful sunset from my evening walk. Sometimes you need to step away from the screen and enjoy nature. 🌅',
			timestamp: '3 days ago',
			likes: 156,
			comments: 28,
			isLiked: true,
			image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
		}
	]);
	
	let isEditing = $state(false);
	let editedProfile = $state({ ...profileUser });
	let activeTab = $state('posts');
	
	function handleBack() {
		goto('/feed');
	}
	
	function handleEditProfile() {
		isEditing = true;
		editedProfile = { ...profileUser };
	}
	
	function handleCancelEdit() {
		isEditing = false;
		editedProfile = { ...profileUser };
	}
	
	function handleSaveProfile() {
		profileUser = { ...editedProfile };
		isEditing = false;
	}
	
	function handleFollow() {
		// Toggle follow state
		if (profileUser.isOwnProfile) return;
		
		profileUser.followers += profileUser.isFollowing ? -1 : 1;
		profileUser.isFollowing = !profileUser.isFollowing;
	}
	
	function toggleLike(postId: string) {
		userPosts = userPosts.map(post => {
			if (post.id === postId) {
				return {
					...post,
					isLiked: !post.isLiked,
					likes: post.isLiked ? post.likes - 1 : post.likes + 1
				};
			}
			return post;
		});
	}
	
	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}
</script>

<svelte:head>
	<title>{profileUser.name} - Profile</title>
</svelte:head>

<div class="profile">
	<!-- Cover Image -->
	<div class="cover-image">
		<img src={profileUser.coverImage} alt="Cover" />
		{#if profileUser.isOwnProfile}
			<button class="edit-cover-btn">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
					<circle cx="12" cy="13" r="4"></circle>
				</svg>
			</button>
		{/if}
	</div>
	
	<!-- Profile Header -->
	<div class="profile-header">
		<div class="header-content">
			<button class="back-btn" on:click={handleBack}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7"></path>
				</svg>
			</button>
			
			<div class="profile-info">
				<div class="avatar-section">
					<img src={profileUser.avatar} alt={profileUser.name} class="profile-avatar" />
					{#if profileUser.isOwnProfile}
						<button class="edit-avatar-btn">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
								<circle cx="12" cy="13" r="4"></circle>
							</svg>
						</button>
					{/if}
				</div>
				
				<div class="profile-details">
					<div class="name-verification">
						<h1>{profileUser.name}</h1>
						{#if profileUser.isVerified}
							<div class="verified-badge" title="Verified account">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
								</svg>
							</div>
						{/if}
					</div>
					
					<p class="username">@{profileUser.username}</p>
					
					{#if isEditing}
						<div class="edit-forms">
							<textarea 
								bind:value={editedProfile.bio} 
								placeholder="Tell us about yourself..."
								rows="3"
							></textarea>
							<input 
								bind:value={editedProfile.location} 
								placeholder="Location"
								type="text"
							/>
							<input 
								bind:value={editedProfile.website} 
								placeholder="Website"
								type="url"
							/>
							<div class="edit-actions">
								<button class="btn-secondary" on:click={handleCancelEdit}>Cancel</button>
								<button class="btn-primary" on:click={handleSaveProfile}>Save Changes</button>
							</div>
						</div>
					{:else}
						{#if profileUser.bio}
							<p class="bio">{profileUser.bio}</p>
						{/if}
						
						<div class="profile-meta">
							{#if profileUser.location}
								<div class="meta-item">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
										<circle cx="12" cy="10" r="3"></circle>
									</svg>
									{profileUser.location}
								</div>
							{/if}
							
							{#if profileUser.website}
								<div class="meta-item">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
										<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
									</svg>
									<a href={profileUser.website} target="_blank" rel="noopener noreferrer">
										{profileUser.website}
									</a>
								</div>
							{/if}
							
							<div class="meta-item">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M8 7V3a4 4 0 0 1 8 0v4M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"></path>
								</svg>
								Joined {profileUser.joinedDate}
							</div>
						</div>
					{/if}
					
					<div class="stats">
						<div class="stat">
							<span class="stat-number">{formatNumber(profileUser.following)}</span>
							<span class="stat-label">Following</span>
						</div>
						<div class="stat">
							<span class="stat-number">{formatNumber(profileUser.followers)}</span>
							<span class="stat-label">Followers</span>
						</div>
						<div class="stat">
							<span class="stat-number">{formatNumber(profileUser.posts)}</span>
							<span class="stat-label">Posts</span>
						</div>
					</div>
					
					<div class="profile-actions">
						{#if profileUser.isOwnProfile}
							<button class="btn-secondary" on:click={handleEditProfile}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
								</svg>
								Edit Profile
							</button>
						{:else}
							<button 
								class="btn-primary {profileUser.isFollowing ? 'following' : ''}" 
								on:click={handleFollow}
							>
								{profileUser.isFollowing ? 'Following' : 'Follow'}
							</button>
							<button class="btn-secondary">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
								</svg>
								Message
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Profile Content -->
	<div class="profile-content">
		<div class="content-tabs">
			<button 
				class="tab {activeTab === 'posts' ? 'active' : ''}" 
				on:click={() => activeTab = 'posts'}
			>
				Posts
			</button>
			<button 
				class="tab {activeTab === 'about' ? 'active' : ''}" 
				on:click={() => activeTab = 'about'}
			>
				About
			</button>
			<button 
				class="tab {activeTab === 'photos' ? 'active' : ''}" 
				on:click={() => activeTab = 'photos'}
			>
				Photos
			</button>
		</div>
		
		<div class="tab-content">
			{#if activeTab === 'posts'}
				<div class="posts">
					{#each userPosts as post (post.id)}
						<article class="post">
							<div class="post-content">
								<p>{post.content}</p>
								{#if post.image}
									<img src={post.image} alt="Post image" class="post-image" />
								{/if}
							</div>
							
							<div class="post-meta">
								<span class="post-timestamp">{post.timestamp}</span>
								
								<div class="post-actions">
									<button 
										class="action-button {post.isLiked ? 'liked' : ''}" 
										on:click={() => toggleLike(post.id)}
									>
										<svg width="18" height="18" viewBox="0 0 24 24" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
											<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
										</svg>
										{post.likes}
									</button>
									<button class="action-button">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
										</svg>
										{post.comments}
									</button>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{:else if activeTab === 'about'}
				<div class="about-section">
					<h3>About {profileUser.name}</h3>
					<div class="about-content">
						<div class="about-item">
							<h4>Bio</h4>
							<p>{profileUser.bio || 'No bio available.'}</p>
						</div>
						
						<div class="about-item">
							<h4>Details</h4>
							<ul>
								{#if profileUser.location}
									<li><strong>Location:</strong> {profileUser.location}</li>
								{/if}
								{#if profileUser.website}
									<li><strong>Website:</strong> <a href={profileUser.website} target="_blank" rel="noopener noreferrer">{profileUser.website}</a></li>
								{/if}
								<li><strong>Joined:</strong> {profileUser.joinedDate}</li>
								<li><strong>Posts:</strong> {formatNumber(profileUser.posts)}</li>
							</ul>
						</div>
					</div>
				</div>
			{:else if activeTab === 'photos'}
				<div class="photos-section">
					<h3>Photos</h3>
					<div class="photos-grid">
						{#each userPosts.filter(post => post.image) as post (post.id)}
							<img src={post.image} alt="User photo" class="photo-item" />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.profile {
		min-height: 100vh;
		background: #f5f5f5;
	}
	
	.cover-image {
		position: relative;
		height: 300px;
		overflow: hidden;
	}
	
	.cover-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.edit-cover-btn {
		position: absolute;
		bottom: 16px;
		right: 16px;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		padding: 8px;
		border-radius: 6px;
		cursor: pointer;
		color: #666;
	}
	
	.profile-header {
		background: white;
		position: relative;
	}
	
	.header-content {
		max-width: 600px;
		margin: 0 auto;
		position: relative;
	}
	
	.back-btn {
		position: absolute;
		left: -60px;
		top: 20px;
		background: white;
		border: none;
		padding: 8px;
		border-radius: 6px;
		cursor: pointer;
		color: #666;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	
	.profile-info {
		padding: 0 20px 20px;
	}
	
	.avatar-section {
		position: relative;
		margin-bottom: 16px;
	}
	
	.profile-avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	
	.edit-avatar-btn {
		position: absolute;
		bottom: 8px;
		right: 8px;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		padding: 6px;
		border-radius: 50%;
		cursor: pointer;
		color: #666;
	}
	
	.name-verification {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
	}
	
	h1 {
		font-size: 24px;
		font-weight: 700;
		color: #333;
		margin: 0;
	}
	
	.verified-badge {
		color: #1da1f2;
	}
	
	.username {
		color: #666;
		margin-bottom: 16px;
		font-size: 16px;
	}
	
	.bio {
		line-height: 1.5;
		color: #333;
		margin-bottom: 16px;
	}
	
	.profile-meta {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 16px;
	}
	
	.meta-item {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #666;
		font-size: 14px;
	}
	
	.meta-item a {
		color: #667eea;
		text-decoration: none;
	}
	
	.meta-item a:hover {
		text-decoration: underline;
	}
	
	.stats {
		display: flex;
		gap: 24px;
		margin-bottom: 20px;
	}
	
	.stat {
		display: flex;
		flex-direction: column;
	}
	
	.stat-number {
		font-weight: 600;
		font-size: 18px;
		color: #333;
	}
	
	.stat-label {
		color: #666;
		font-size: 14px;
	}
	
	.profile-actions {
		display: flex;
		gap: 12px;
	}
	
	.btn-primary, .btn-secondary {
		padding: 10px 16px;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	
	.btn-primary {
		background: #667eea;
		color: white;
		border: none;
	}
	
	.btn-primary:hover {
		background: #5a67d8;
	}
	
	.btn-primary.following {
		background: #28a745;
		color: white;
	}
	
	.btn-secondary {
		background: #f8f9fa;
		color: #333;
		border: 1px solid #dee2e6;
	}
	
	.btn-secondary:hover {
		background: #e9ecef;
	}
	
	.edit-forms {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 16px;
	}
	
	.edit-forms textarea,
	.edit-forms input {
		width: 100%;
		padding: 12px;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		font-family: inherit;
		font-size: 14px;
	}
	
	.edit-forms textarea:focus,
	.edit-forms input:focus {
		outline: none;
		border-color: #667eea;
	}
	
	.edit-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}
	
	.profile-content {
		max-width: 600px;
		margin: 0 auto;
		background: white;
		margin-top: 20px;
		border-radius: 12px;
		overflow: hidden;
	}
	
	.content-tabs {
		display: flex;
		border-bottom: 1px solid #e1e5e9;
	}
	
	.tab {
		flex: 1;
		padding: 16px;
		background: none;
		border: none;
		cursor: pointer;
		color: #666;
		font-weight: 500;
		transition: all 0.2s;
	}
	
	.tab.active {
		color: #667eea;
		border-bottom: 2px solid #667eea;
	}
	
	.tab:hover {
		background: #f8f9fa;
	}
	
	.tab-content {
		padding: 20px;
	}
	
	.posts {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	
	.post {
		padding: 20px;
		background: #f8f9fa;
		border-radius: 12px;
	}
	
	.post-content p {
		line-height: 1.5;
		margin-bottom: 12px;
	}
	
	.post-image {
		width: 100%;
		height: auto;
		border-radius: 8px;
		object-fit: cover;
	}
	
	.post-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 16px;
		padding-top: 12px;
		border-top: 1px solid #e1e5e9;
	}
	
	.post-timestamp {
		color: #666;
		font-size: 14px;
	}
	
	.post-actions {
		display: flex;
		gap: 16px;
	}
	
	.action-button {
		background: none;
		border: none;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		border-radius: 4px;
		color: #666;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.2s;
	}
	
	.action-button:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	
	.action-button.liked {
		color: #e0245e;
	}
	
	.about-section h3,
	.photos-section h3 {
		margin-bottom: 20px;
		color: #333;
	}
	
	.about-content {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	
	.about-item h4 {
		margin-bottom: 8px;
		color: #333;
		font-size: 16px;
	}
	
	.about-item ul {
		list-style: none;
		padding: 0;
	}
	
	.about-item li {
		padding: 4px 0;
		color: #666;
	}
	
	.about-item a {
		color: #667eea;
		text-decoration: none;
	}
	
	.about-item a:hover {
		text-decoration: underline;
	}
	
	.photos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 12px;
	}
	
	.photo-item {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
	}
	
	.photo-item:hover {
		transform: scale(1.05);
	}
	
	@media (max-width: 768px) {
		.header-content {
			max-width: none;
			margin: 0;
		}
		
		.back-btn {
			position: static;
			margin-bottom: 16px;
		}
		
		.profile-info {
			padding: 0 16px 16px;
		}
		
		.stats {
			gap: 16px;
		}
		
		.profile-actions {
			flex-direction: column;
		}
		
		.content-tabs {
			overflow-x: auto;
		}
		
		.tab {
			min-width: 120px;
		}
	}
</style>