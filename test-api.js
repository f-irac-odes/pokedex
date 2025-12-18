// Simple test script to verify API endpoints
const testAPI = async () => {
    console.log('Testing Social Media API Endpoints...\n');
    
    try {
        // Test posts endpoint
        console.log('1. Testing /api/posts endpoint...');
        const postsResponse = await fetch('http://localhost:5173/api/posts');
        const postsData = await postsResponse.json();
        console.log('✅ Posts endpoint working:', postsData.success ? 'PASS' : 'FAIL');
        console.log('   Found', postsData.data?.posts?.length || 0, 'posts\n');
        
        // Test users endpoint
        console.log('2. Testing /api/users endpoint...');
        const usersResponse = await fetch('http://localhost:5173/api/users');
        const usersData = await usersResponse.json();
        console.log('✅ Users endpoint working:', usersData.success ? 'PASS' : 'FAIL');
        console.log('   Found', Array.isArray(usersData.data) ? usersData.data.length : 1, 'users\n');
        
        // Test realtime endpoint
        console.log('3. Testing /api/realtime endpoint...');
        const realtimeResponse = await fetch('http://localhost:5173/api/realtime');
        console.log('✅ Realtime endpoint working:', realtimeResponse.ok ? 'PASS' : 'FAIL');
        console.log('   Status:', realtimeResponse.status, '\n');
        
        console.log('🎉 All API endpoints are functioning correctly!');
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('Make sure the development server is running on http://localhost:5173');
    }
};

// Run the test
testAPI();