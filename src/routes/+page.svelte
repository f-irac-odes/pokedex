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
    <title>Memedex - Trade & Share Media Content</title>
    <meta name="description" content="Join Memedex to trade and share high-quality media content. Buy, sell, and discover amazing images and videos from creators worldwide." />
</svelte:head>

<div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1>Welcome to Memedex</h1>
                <p class="hero-subtitle">
                    Trade and share high-quality media content with creators worldwide. 
                    Buy, sell, and discover amazing images and videos in our vibrant marketplace.
                </p>
                <div class="hero-actions">
                    <button class="btn-primary" on:click={navigateToRegister}>
                        Start Trading
                    </button>
                    <button class="btn-secondary" on:click={navigateToMarketplace}>
                        Browse Marketplace
                    </button>
                    <button class="btn-ghost" on:click={navigateToLogin}>
                        Sign In
                    </button>
                </div>
            </div>
            <div class="hero-visual">
                <div class="mockup-phone">
                    <div class="phone-screen">
                        <img 
                            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=800&fit=crop" 
                            alt="Memedex Mobile Interface" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features">
        <div class="container">
            <h2>Why Choose Memedex?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <span style="font-size: 24px;">💰</span>
                    </div>
                    <h3>Trade Media Content</h3>
                    <p>Buy and sell high-quality images and videos using our credit system. Monetize your creative content and discover amazing media from others.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <span style="font-size: 24px;">🖼️</span>
                    </div>
                    <h3>Upload & Share</h3>
                    <p>Upload your photos and videos to share with the community. Set prices for your content or offer it for free to build your audience.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <span style="font-size: 24px;">🎥</span>
                    </div>
                    <h3>Discover Content</h3>
                    <p>Browse a marketplace of creative content from talented creators worldwide. Find the perfect media for your projects.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <span style="font-size: 24px;">👥</span>
                    </div>
                    <h3>Guest Access</h3>
                    <p>No registration required to browse! Check out our marketplace and see what content is available before joining our community.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Demo Section -->
    <section class="demo">
        <div class="container">
            <div class="demo-content">
                <div class="demo-text">
                    <h2>See Memedex in Action</h2>
                    <p>
                        Experience our intuitive marketplace interface designed for seamless media trading. 
                        Browse, buy, sell, and discover amazing content from creators around the world.
                    </p>
                    <div class="demo-buttons">
                        <button class="btn-demo" on:click={navigateToMarketplace}>
                            Explore Marketplace
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                        <button class="btn-demo secondary" on:click={navigateToFeed}>
                            Browse Feed
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="demo-screenshots">
                    <div class="screenshot">
                        <img 
                            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop" 
                            alt="Marketplace Interface" 
                        />
                        <div class="screenshot-label">📈 Marketplace</div>
                    </div>
                    <div class="screenshot">
                        <img 
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" 
                            alt="Feed Interface" 
                        />
                        <div class="screenshot-label">🏠 Feed</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <div class="container">
            <h2>Ready to Start Trading?</h2>
            <p>Join thousands of creators already monetizing their content on Memedex</p>
            <div class="cta-actions">
                <button class="btn-primary-large" on:click={navigateToRegister}>
                    Start Earning Today
                </button>
                <button class="btn-link" on:click={navigateToMarketplace}>
                    Explore Marketplace First
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
    
    .btn-ghost {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 12px 28px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-ghost:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
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
    
    .demo-buttons {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
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
    
    .btn-demo.secondary {
        background: transparent;
        color: #667eea;
        border: 2px solid #667eea;
    }
    
    .btn-demo.secondary:hover {
        background: #667eea;
        color: white;
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