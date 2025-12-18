<script lang="ts">
	import { goto } from '$app/navigation';
	
	let { children } = $props();
	
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

<div class="app-layout">
	<nav class="main-nav">
		<div class="nav-container">
			<div class="nav-brand" on:click={navigateToFeed}>
				<h1>SocialApp</h1>
			</div>
			
			<div class="nav-links">
				<button on:click={navigateToLogin} class="nav-link">Login</button>
				<button on:click={navigateToRegister} class="nav-link">Register</button>
				<button on:click={navigateToFeed} class="nav-link">Feed</button>
			</div>
		</div>
	</nav>
	
	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	.app-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.main-nav {
		background: white;
		border-bottom: 1px solid #e1e5e9;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	
	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
	}
	
	.nav-brand {
		cursor: pointer;
	}
	
	.nav-brand h1 {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
		color: #667eea;
	}
	
	.nav-links {
		display: flex;
		gap: 20px;
		align-items: center;
	}
	
	.nav-link {
		background: none;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		color: #666;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.nav-link:hover {
		background: #f8f9fa;
		color: #333;
	}
	
	.main-content {
		flex: 1;
		background: #f5f5f5;
	}
	
	@media (max-width: 768px) {
		.nav-container {
			padding: 12px 16px;
		}
		
		.nav-links {
			gap: 12px;
		}
		
		.nav-link {
			padding: 6px 12px;
			font-size: 14px;
		}
	}
</style>