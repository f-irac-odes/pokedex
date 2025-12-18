<script lang="ts">
	import { goto } from '$app/navigation';
	
	let fullName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let error = $state('');
	
	async function handleRegister() {
		// Validation
		if (!fullName || !email || !password || !confirmPassword) {
			error = 'Please fill in all fields';
			return;
		}
		
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}
		
		if (password.length < 6) {
			error = 'Password must be at least 6 characters long';
			return;
		}
		
		isLoading = true;
		error = '';
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// For demo purposes, redirect to feed
			goto('/feed');
		} catch (err) {
			error = 'Registration failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	function switchToLogin() {
		goto('/login');
	}
</script>

<svelte:head>
	<title>Register - Social App</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<h1>Create Account</h1>
		<p class="subtitle">Join our community today</p>
		
		<form on:submit|preventDefault={handleRegister}>
			<div class="form-group">
				<label for="fullName">Full Name</label>
				<input
					id="fullName"
					type="text"
					bind:value={fullName}
					placeholder="Enter your full name"
					required
				/>
			</div>
			
			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
				/>
			</div>
			
			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Create a password"
					required
				/>
			</div>
			
			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					placeholder="Confirm your password"
					required
				/>
			</div>
			
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			<button type="submit" class="btn-primary" disabled={isLoading}>
				{isLoading ? 'Creating account...' : 'Create Account'}
			</button>
		</form>
		
		<div class="auth-footer">
			<p>Already have an account? 
				<button type="button" class="link-btn" on:click={switchToLogin}>
					Sign in
				</button>
			</p>
		</div>
	</div>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20px;
	}
	
	.auth-card {
		background: white;
		padding: 40px;
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}
	
	h1 {
		margin: 0 0 8px;
		color: #333;
		text-align: center;
		font-size: 28px;
		font-weight: 600;
	}
	
	.subtitle {
		margin: 0 0 32px;
		color: #666;
		text-align: center;
		font-size: 16px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	label {
		display: block;
		margin-bottom: 8px;
		font-weight: 500;
		color: #333;
	}
	
	input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}
	
	input:focus {
		outline: none;
		border-color: #667eea;
	}
	
	.btn-primary {
		width: 100%;
		padding: 14px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.btn-primary:hover:not(:disabled) {
		background: #5a67d8;
	}
	
	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.error {
		background: #fed7d7;
		color: #c53030;
		padding: 12px;
		border-radius: 6px;
		margin-bottom: 16px;
		font-size: 14px;
	}
	
	.auth-footer {
		margin-top: 24px;
		text-align: center;
		color: #666;
	}
	
	.link-btn {
		background: none;
		border: none;
		color: #667eea;
		cursor: pointer;
		text-decoration: underline;
		font-size: inherit;
	}
	
	.link-btn:hover {
		color: #5a67d8;
	}
</style>