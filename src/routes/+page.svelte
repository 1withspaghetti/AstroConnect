<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import GoogleIcon from '~icons/logos/google-icon'
</script>

<main class="relative flex min-h-screen flex-col items-center justify-center">
	<enhanced:img
		alt="Starry Mountain Background"
		class="absolute top-0 left-0 w-full h-full object-cover object-center"
		src="$lib/assets/imgs/mike-dierken-SBlrPpAR5QU-unsplash.jpg?w=1920;1080"
	/>
	<div class="absolute bottom-0 right-0 bg-black/50 p-2 text-sm text-white">
		Photo by <a
			class="underline"
			href="https://unsplash.com/@dierken?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
			>Mike Dierken</a
		>
		on
		<a
			class="underline"
			href="https://unsplash.com/photos/a-mountain-with-a-starry-sky-above-it-SBlrPpAR5QU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
			>Unsplash</a
		>
	</div>
	<div class="absolute flex flex-col items-center">
		<h1 class="text-white tracking-wide text-4xl sm:text-7xl font-bold italic mb-8">AstroConnect 🌟</h1>
		<Card.Root class="w-full max-w-sm">
			<Card.Header>
				<Card.Title class="text-xl">Login/Sign Up</Card.Title>
				<Card.Description>Please use your Net ID email</Card.Description>
			</Card.Header>
			<Card.Footer class="flex-col gap-2">
				<Button variant="default" href="/dashboard" class="w-full"><GoogleIcon /> Login with Google</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</main>
