<script lang="ts">
    import { goto } from '$app/navigation';
    import { currentUser, logout } from '$lib/stores';
    import type { User } from '$lib/database';
    
    let { children } = $props();
    
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
                <h1>🎨 MemeLand</h1>
                <span class="tagline">Collect • Trade • Earn</span>
            </div>
            
            <div class="nav-links">
                {#if user}
                    <div class="user-info">
                        <img src={user.avatar} alt={user.name} class="user-avatar" />
                        <div class="user-details">
                            <span class="user-name">{user.name}</span>
                            <span class="user-credits">💰 {user.credits}</span>
                        </div>
                    </div>
                    <button on:click={navigateToFeed} class="nav-link">🏠 Feed</button>
                    <button on:click={navigateToMarketplace} class="nav-link">📦 Marketplace</button>
                    <button on:click={navigateToProfile} class="nav-link">👤 Profile</button>
                    <button on:click={handleLogout} class="nav-link logout">🚪 Logout</button>
                {:else}
                    <button on:click={navigateToFeed} class="nav-link">👀 Browse</button>
                    <button on:click={navigateToMarketplace} class="nav-link">📦 Marketplace</button>
                    <button on:click={navigateToLogin} class="nav-link">🔐 Login</button>
                    <button on:click={navigateToRegister} class="nav-link register">🚀 Join Now</button>
                {/if}
            </div>
        </div>
    </nav>
    
    <main class="main-content">
        {@render children()}
    </main>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Outfit:wght@400;600;700;800&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(body) {
        font-family: 'Fredoka', sans-serif;
    }
    
    .app-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
    .main-nav {
        background: linear-gradient(135deg, rgba(15, 15, 35, 0.95), rgba(26, 26, 63, 0.95));
        backdrop-filter: blur(20px);
        border-bottom: 2px solid rgba(102, 126, 234, 0.4);
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    
    .nav-container {
        max-width: 1400px;
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
        gap: 2px;
    }
    
    .nav-brand h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 800;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-family: 'Outfit', sans-serif;
        letter-spacing: -1px;
    }
    
    .tagline {
        font-size: 12px;
        color: #a0aec0;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        background: rgba(102, 126, 234, 0.15);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 12px;
        margin-right: 8px;
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(102, 126, 234, 0.6);
    }

    .user-details {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .user-name {
        font-size: 13px;
        font-weight: 700;
        color: #e0e7ff;
    }

    .user-credits {
        font-size: 12px;
        color: #fbbf24;
        font-weight: 600;
    }
    
    .nav-links {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .nav-link {
        background: rgba(102, 126, 234, 0.1);
        border: 1px solid rgba(102, 126, 234, 0.3);
        padding: 10px 16px;
        border-radius: 8px;
        color: #a0aec0;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        font-size: 14px;
        font-family: 'Fredoka', sans-serif;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .nav-link:hover {
        background: rgba(102, 126, 234, 0.25);
        color: #e0e7ff;
        border-color: rgba(102, 126, 234, 0.6);
    }
    
    .nav-link.register {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-color: transparent;
    }
    
    .nav-link.register:hover {
        background: linear-gradient(135deg, #764ba2, #f093fb);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    
    .nav-link.logout {
        color: #ff6b6b;
        border-color: rgba(255, 107, 107, 0.3);
    }
    
    .nav-link.logout:hover {
        background: rgba(255, 107, 107, 0.1);
        border-color: rgba(255, 107, 107, 0.5);
    }
    
    .main-content {
        flex: 1;
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a3f 50%, #2d1b3d 100%);
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
            width: 100%;
            justify-content: flex-end;
        }
        
        .nav-link {
            padding: 8px 12px;
            font-size: 12px;
        }
        
        .user-info {
            width: 100%;
            margin: 8px 0;
            order: -1;
        }

        .user-name {
            display: none;
        }

        .user-credits {
            font-size: 11px;
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

        .nav-brand {
            width: 100%;
        }
    }
</style>
