<script lang="ts">
    import { goto } from '$app/navigation';
    import { currentUser, logout } from '$lib/stores';
    import type { User } from '$lib/database';
    
    let { children } = $props();
    
    // Reactive statement to get current user
    let user = $state<User | null>(null);
    $effect(() => {
        const unsubscribe = currentUser.subscribe(u => user = u);
        return unsubscribe;
    });
    
    function navigateToLogin() {
        goto('/login');
    }
    
    function navigateToRegister() {
        goto('/register');
    }
    
    function navigateToFeed() {
        goto('/feed');
    }
    
    function navigateToProfile() {
        if (user) {
            goto(`/profile/${user.username}`);
        }
    }
    
    function navigateToMarketplace() {
        goto('/marketplace');
    }
    
    async function handleLogout() {
        try {
            await logout();
            goto('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
</script>

<div class="app-layout">
    <nav class="main-nav">
        <div class="nav-container">
            <div class="nav-brand" on:click={navigateToFeed}>
                <h1>Memedex</h1>
                <span class="tagline">Trade & Share Media</span>
            </div>
            
            <div class="nav-links">
                {#if user}
                    <!-- Authenticated user navigation -->
                    <div class="user-info">
                        <img src={user.avatar} alt={user.name} class="user-avatar" />
                        <span class="user-credits">{user.credits} credits</span>
                    </div>
                    <button on:click={navigateToFeed} class="nav-link">Feed</button>
                    <button on:click={navigateToMarketplace} class="nav-link">Marketplace</button>
                    <button on:click={navigateToProfile} class="nav-link">Profile</button>
                    <button on:click={handleLogout} class="nav-link logout">Logout</button>
                {:else}
                    <!-- Guest user navigation -->
                    <button on:click={navigateToFeed} class="nav-link">Browse</button>
                    <button on:click={navigateToMarketplace} class="nav-link">Marketplace</button>
                    <button on:click={navigateToLogin} class="nav-link">Login</button>
                    <button on:click={navigateToRegister} class="nav-link register">Sign Up</button>
                {/if}
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
        display: flex;
        flex-direction: column;
    }
    
    .nav-brand h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 800;
        color: #667eea;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .tagline {
        font-size: 12px;
        color: #666;
        margin-top: -2px;
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px;
        background: #f8f9fa;
        border-radius: 20px;
        border: 1px solid #e1e5e9;
    }
    
    .user-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .user-credits {
        font-size: 12px;
        font-weight: 600;
        color: #667eea;
    }
    
    .nav-links {
        display: flex;
        gap: 16px;
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
        text-decoration: none;
        font-size: 14px;
    }
    
    .nav-link:hover {
        background: #f8f9fa;
        color: #333;
    }
    
    .nav-link.register {
        background: #667eea;
        color: white;
    }
    
    .nav-link.register:hover {
        background: #5a6fd8;
        color: white;
    }
    
    .nav-link.logout {
        color: #dc3545;
    }
    
    .nav-link.logout:hover {
        background: #fff5f5;
        color: #c53030;
    }
    
    .main-content {
        flex: 1;
        background: #f5f5f5;
    }
    
    @media (max-width: 768px) {
        .nav-container {
            padding: 12px 16px;
            flex-wrap: wrap;
        }
        
        .nav-brand h1 {
            font-size: 24px;
        }
        
        .tagline {
            display: none;
        }
        
        .nav-links {
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .nav-link {
            padding: 6px 10px;
            font-size: 12px;
        }
        
        .user-info {
            display: none;
        }
    }
    
    @media (max-width: 480px) {
        .nav-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }
        
        .nav-links {
            width: 100%;
            justify-content: space-between;
        }
    }
</style>