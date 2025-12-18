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
    
    function navigateToMarketplace() {
        goto('/marketplace');
    }
</script>

<svelte:head>
    <title>MemeLand - Collect Them All! 🎨</title>
    <meta name="description" content="Welcome to MemeLand! Collect, trade, and monetize amazing memes and media. Buy memes with credits, earn from likes, and build your collection!" />
</svelte:head>

<div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
        </div>
        
        <div class="hero-content">
            <div class="hero-text">
                <h1 class="hero-title">
                    <span class="collect">Collect</span>
                    <span class="them">them</span>
                    <span class="all">all!</span>
                </h1>
                <p class="hero-subtitle">
                    Welcome to MemeLand - the ultimate playground for meme collectors and creators 🚀
                </p>
                <p class="hero-tagline">
                    Get paid for likes • Trade memes • Build your collection • Earn credits
                </p>
                <div class="hero-actions">
                    <button class="btn-primary" on:click={navigateToRegister}>
                        🚀 Start Collecting
                    </button>
                    <button class="btn-secondary" on:click={navigateToFeed}>
                        👀 Browse Feed
                    </button>
                    <button class="btn-ghost" on:click={navigateToLogin}>
                        🔐 Sign In
                    </button>
                </div>
            </div>
            <div class="hero-visual">
                <div class="floating-cards">
                    <div class="card card1">💎</div>
                    <div class="card card2">🎨</div>
                    <div class="card card3">🔥</div>
                    <div class="card card4">⚡</div>
                    <div class="card card5">🌟</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features">
        <h2>How MemeLand Works</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-emoji">💸</div>
                <h3>Get Paid for Likes</h3>
                <p>Every like on your content earns you 5 credits. Your audience helps you earn!</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-emoji">📦</div>
                <h3>Collect Memes</h3>
                <p>Build your epic collection by trading and collecting memes from creators worldwide.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-emoji">🎪</div>
                <h3>Everything's For Trade</h3>
                <p>Every post is on the marketplace. Buy, sell, or trade any content you love.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-emoji">⭐</div>
                <h3>Earn More Credits</h3>
                <p>Create amazing content, get likes, earn credits, and reinvest in your collection!</p>
            </div>

            <div class="feature-card">
                <div class="feature-emoji">🎯</div>
                <h3>Share & Comment</h3>
                <p>Engage with the community through likes and comments. Every interaction matters!</p>
            </div>

            <div class="feature-card">
                <div class="feature-emoji">🏆</div>
                <h3>Rise to the Top</h3>
                <p>Create viral content, collect rare memes, and become a MemeLand legend!</p>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <h2>Ready to Start Your Collection? 🎉</h2>
        <p>Join thousands of meme collectors and creators on MemeLand</p>
        <div class="cta-actions">
            <button class="btn-primary-large" on:click={navigateToRegister}>
                Let's Go! 🚀
            </button>
            <button class="btn-link" on:click={navigateToMarketplace}>
                Browse Marketplace First →
            </button>
        </div>
    </section>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Outfit:wght@400;600;700;800&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .landing-page {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        font-family: 'Fredoka', sans-serif;
        overflow: hidden;
    }

    .hero {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        overflow: hidden;
    }

    .hero-stars {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .star {
        position: absolute;
        width: 3px;
        height: 3px;
        background: white;
        border-radius: 50%;
        animation: twinkle 3s infinite;
    }

    .star:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
    .star:nth-child(2) { top: 30%; right: 15%; animation-delay: 0.5s; }
    .star:nth-child(3) { top: 60%; left: 20%; animation-delay: 1s; }
    .star:nth-child(4) { top: 70%; right: 10%; animation-delay: 1.5s; }
    .star:nth-child(5) { top: 50%; right: 30%; animation-delay: 2s; }

    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }

    .hero-content {
        max-width: 1200px;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
        z-index: 1;
    }

    .hero-text h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 5rem;
        font-weight: 800;
        margin-bottom: 24px;
        line-height: 1.1;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }

    .hero-title .collect {
        display: block;
        background: linear-gradient(45deg, #ff006e, #fb5607);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: bounce 2s infinite;
    }

    .hero-title .them {
        display: block;
        background: linear-gradient(45deg, #fb5607, #ffbe0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: bounce 2s infinite 0.2s;
    }

    .hero-title .all {
        display: block;
        background: linear-gradient(45deg, #ffbe0b, #8338ec);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: bounce 2s infinite 0.4s;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .hero-subtitle {
        font-size: 1.5rem;
        color: white;
        margin-bottom: 12px;
        font-weight: 600;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .hero-tagline {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 40px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .hero-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }

    .btn-primary {
        background: white;
        color: #667eea;
        border: none;
        padding: 16px 32px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        font-family: 'Fredoka', sans-serif;
    }

    .btn-primary:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 2px solid white;
        padding: 14px 30px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
        font-family: 'Fredoka', sans-serif;
    }

    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
    }

    .btn-ghost {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 14px 30px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        font-family: 'Fredoka', sans-serif;
    }

    .btn-ghost:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
    }

    .hero-visual {
        position: relative;
        height: 400px;
    }

    .floating-cards {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .card {
        position: absolute;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: float 4s ease-in-out infinite;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .card1 { top: 20px; left: 20px; animation-delay: 0s; }
    .card2 { top: 100px; right: 40px; animation-delay: 0.5s; }
    .card3 { bottom: 80px; left: 40px; animation-delay: 1s; }
    .card4 { top: 50%; right: 20px; animation-delay: 1.5s; }
    .card5 { bottom: 20px; right: 50%; animation-delay: 2s; }

    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
    }

    .features {
        padding: 100px 20px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        backdrop-filter: blur(10px);
    }

    .features h2 {
        text-align: center;
        font-size: 3rem;
        font-weight: 800;
        color: white;
        margin-bottom: 60px;
        font-family: 'Outfit', sans-serif;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .features-grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }

    .feature-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 40px 30px;
        border-radius: 20px;
        text-align: center;
        transition: all 0.3s;
        color: white;
    }

    .feature-card:hover {
        transform: translateY(-10px);
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .feature-emoji {
        font-size: 48px;
        margin-bottom: 20px;
        animation: spin 3s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .feature-card h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 16px;
        font-family: 'Outfit', sans-serif;
    }

    .feature-card p {
        font-size: 1rem;
        line-height: 1.6;
        opacity: 0.9;
    }

    .cta {
        padding: 100px 20px;
        background: linear-gradient(135deg, #ff006e, #8338ec, #3a86ff);
        color: white;
        text-align: center;
    }

    .cta h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 16px;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    .cta p {
        font-size: 1.25rem;
        margin-bottom: 40px;
        opacity: 0.95;
    }

    .cta-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .btn-primary-large {
        background: white;
        color: #8338ec;
        border: none;
        padding: 18px 40px;
        border-radius: 12px;
        font-size: 20px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        font-family: 'Fredoka', sans-serif;
    }

    .btn-primary-large:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }

    .btn-link {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        text-decoration: none;
        font-weight: 700;
        opacity: 0.9;
        transition: all 0.3s;
        font-family: 'Fredoka', sans-serif;
    }

    .btn-link:hover {
        opacity: 1;
        transform: translateX(4px);
    }

    @media (max-width: 768px) {
        .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
        }

        .hero-text h1 {
            font-size: 3rem;
        }

        .hero-subtitle {
            font-size: 1.25rem;
        }

        .hero-tagline {
            font-size: 1rem;
        }

        .hero-visual {
            height: 250px;
        }

        .features h2 {
            font-size: 2rem;
        }

        .cta h2 {
            font-size: 2.5rem;
        }

        .features-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
