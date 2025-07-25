<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import GoogleIcon from '~icons/logos/google-icon';
</script>

<main class="relative flex min-h-screen flex-col items-center justify-center">
	<enhanced:img
		alt="Starry Mountain Background"
		class="absolute top-0 left-0 h-full w-full object-cover object-center"
		src="$lib/assets/imgs/mike-dierken-SBlrPpAR5QU-unsplash.jpg?w=1920;1080"
	/>
	<div class="absolute right-0 bottom-0 bg-black/50 px-2 py-1 text-xs text-white">
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
		<h1 class="mb-8 text-4xl font-bold tracking-wide text-white italic sm:text-7xl">
			AstroConnect 🌟
		</h1>
		<Card.Root class="w-full max-w-sm">
			<Card.Header>
				<Card.Title class="text-xl">Login</Card.Title>
				<Card.Description>Please use your Net ID email</Card.Description>
			</Card.Header>
			<Card.Footer class="flex-col gap-2">
				<Button variant="default" href="/home" class="w-full"
					><GoogleIcon /> Login with Google</Button
				>
			</Card.Footer>
		</Card.Root>
	</div>
</main>
