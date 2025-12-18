<script lang="ts">
	import { goto } from '$app/navigation';
	
	function navigateToLogin() {
		goto('/login');
	}
	
	function navigateToRegister() {
		goto('/register');
	}
	
	function navigateToFeed() {
		goto('/feed');
	}
</script>

<svelte:head>
	<title>SocialApp - Connect with the World</title>
	<meta name="description" content="Join SocialApp to connect with friends, share your thoughts, and discover amazing content from around the world." />
</svelte:head>

<div class="landing-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-content">
			<div class="hero-text">
				<h1>Welcome to SocialApp</h1>
				<p class="hero-subtitle">
					Connect with friends, share your thoughts, and discover amazing content 
					from people around the world.
				</p>
				<div class="hero-actions">
					<button class="btn-primary" on:click={navigateToRegister}>
						Get Started
					</button>
					<button class="btn-secondary" on:click={navigateToLogin}>
						Sign In
					</button>
				</div>
			</div>
			<div class="hero-visual">
				<div class="mockup-phone">
					<div class="phone-screen">
						<img 
							src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=800&fit=crop" 
							alt="Social App Mobile Interface" 
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="features">
		<div class="container">
			<h2>Why Choose SocialApp?</h2>
			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
							<circle cx="9" cy="7" r="4"></circle>
							<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
						</svg>
					</div>
					<h3>Connect with Friends</h3>
					<p>Find and connect with friends, family, and like-minded people from around the globe.</p>
				</div>
				
				<div class="feature-card">
					<div class="feature-icon">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
						</svg>
					</div>
					<h3>Share Your Story</h3>
					<p>Post photos, videos, and thoughts that matter to you with your network.</p>
				</div>
				
				<div class="feature-card">
					<div class="feature-icon">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
						</svg>
					</div>
					<h3>Stay Updated</h3>
					<p>Get real-time updates from the people and topics you care about most.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Demo Section -->
	<section class="demo">
		<div class="container">
			<div class="demo-content">
				<div class="demo-text">
					<h2>See SocialApp in Action</h2>
					<p>
						Experience a modern, intuitive interface designed for seamless social interactions. 
						Our platform makes it easy to connect, share, and discover.
					</p>
					<button class="btn-demo" on:click={navigateToFeed}>
						Try the Demo
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M5 12h14M12 5l7 7-7 7"></path>
						</svg>
					</button>
				</div>
				<div class="demo-screenshots">
					<div class="screenshot">
						<img 
							src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop" 
							alt="Feed Interface" 
						/>
						<div class="screenshot-label">Feed</div>
					</div>
					<div class="screenshot">
						<img 
							src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop" 
							alt="Profile Interface" 
						/>
						<div class="screenshot-label">Profiles</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta">
		<div class="container">
			<h2>Ready to Get Started?</h2>
			<p>Join thousands of users already connecting on SocialApp</p>
			<div class="cta-actions">
				<button class="btn-primary-large" on:click={navigateToRegister}>
					Create Your Account
				</button>
				<button class="btn-link" on:click={navigateToLogin}>
					Already have an account? Sign in
				</button>
			</div>
		</div>
	</section>
</div>

<style>
	.landing-page {
		min-height: 100vh;
	}
	
	.hero {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 80px 20px;
		min-height: 80vh;
		display: flex;
		align-items: center;
	}
	
	.hero-content {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
	}
	
	.hero-text h1 {
		font-size: 3.5rem;
		font-weight: 700;
		margin-bottom: 24px;
		line-height: 1.2;
	}
	
	.hero-subtitle {
		font-size: 1.25rem;
		margin-bottom: 40px;
		opacity: 0.9;
		line-height: 1.6;
	}
	
	.hero-actions {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}
	
	.btn-primary {
		background: white;
		color: #667eea;
		border: none;
		padding: 14px 28px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
	}
	
	.btn-secondary {
		background: transparent;
		color: white;
		border: 2px solid white;
		padding: 12px 28px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.btn-secondary:hover {
		background: white;
		color: #667eea;
	}
	
	.mockup-phone {
		position: relative;
		max-width: 300px;
		margin: 0 auto;
	}
	
	.phone-screen {
		background: #333;
		border-radius: 20px;
		padding: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}
	
	.phone-screen img {
		width: 100%;
		border-radius: 12px;
	}
	
	.features {
		padding: 100px 20px;
		background: white;
	}
	
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}
	
	.features h2 {
		text-align: center;
		font-size: 2.5rem;
		font-weight: 700;
		color: #333;
		margin-bottom: 60px;
	}
	
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 40px;
	}
	
	.feature-card {
		text-align: center;
		padding: 40px 20px;
		border-radius: 12px;
		transition: transform 0.2s;
	}
	
	.feature-card:hover {
		transform: translateY(-5px);
	}
	
	.feature-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 24px;
		background: linear-gradient(135deg, #667eea, #764ba2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}
	
	.feature-card h3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #333;
		margin-bottom: 16px;
	}
	
	.feature-card p {
		color: #666;
		line-height: 1.6;
	}
	
	.demo {
		padding: 100px 20px;
		background: #f8f9fa;
	}
	
	.demo-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
	}
	
	.demo-text h2 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #333;
		margin-bottom: 24px;
	}
	
	.demo-text p {
		font-size: 1.125rem;
		color: #666;
		line-height: 1.6;
		margin-bottom: 32px;
	}
	
	.btn-demo {
		background: #667eea;
		color: white;
		border: none;
		padding: 14px 24px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: background-color 0.2s;
	}
	
	.btn-demo:hover {
		background: #5a67d8;
	}
	
	.demo-screenshots {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	
	.screenshot {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}
	
	.screenshot img {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}
	
	.screenshot-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 8px 16px;
		font-weight: 600;
	}
	
	.cta {
		padding: 100px 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		text-align: center;
	}
	
	.cta h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 16px;
	}
	
	.cta p {
		font-size: 1.25rem;
		margin-bottom: 40px;
		opacity: 0.9;
	}
	
	.cta-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
	
	.btn-primary-large {
		background: white;
		color: #667eea;
		border: none;
		padding: 16px 32px;
		border-radius: 8px;
		font-size: 18px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.btn-primary-large:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
	}
	
	.btn-link {
		background: none;
		border: none;
		color: white;
		font-size: 16px;
		cursor: pointer;
		text-decoration: underline;
		opacity: 0.8;
	}
	
	.btn-link:hover {
		opacity: 1;
	}
	
	@media (max-width: 768px) {
		.hero-content {
			grid-template-columns: 1fr;
			gap: 40px;
			text-align: center;
		}
		
		.hero-text h1 {
			font-size: 2.5rem;
		}
		
		.features-grid {
			grid-template-columns: 1fr;
			gap: 30px;
		}
		
		.demo-content {
			grid-template-columns: 1fr;
			gap: 40px;
			text-align: center;
		}
		
		.demo-screenshots {
			grid-template-columns: 1fr;
		}
		
		.hero-actions {
			justify-content: center;
		}
		
		.cta-actions {
			width: 100%;
		}
		
		.btn-primary-large {
			width: 100%;
		}
	}
</style>