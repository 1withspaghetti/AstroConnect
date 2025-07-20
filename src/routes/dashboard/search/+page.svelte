<script lang="ts">
	import type { PageProps } from './$types';
	import SearchForm from './search-form.svelte';
	import ResearchList from './research-list.svelte';

	let { data }: PageProps = $props();
</script>

<div class="container mx-auto">
	<div class="relative w-full">
		<div class="peer">
			<enhanced:img
				alt="Starry Mountain Background"
				class="max-h-32 w-full object-cover object-center"
				src="$lib/assets/imgs/benjamin-voros-phIFdC6lA4E-unsplash.jpg"
				sizes="(max-width: 1920px) 100vw"
			/>
		</div>
		<div
			class="absolute top-0 left-0 -translate-y-full bg-black/50 px-2 py-1 text-xs text-white transition-transform duration-300 peer-hover:translate-y-0"
		>
			Photo by <a
				href="https://unsplash.com/@vorosbenisop?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				class="underline">Benjamin Voros</a
			>
			on
			<a
				href="https://unsplash.com/photos/snow-mountain-under-stars-phIFdC6lA4E?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				class="underline">Unsplash</a
			>
		</div>
	</div>
	<div class="-translate-y-5 px-8">
		<SearchForm />
	</div>
	<ResearchList items={data.researchOpportunities} />
</div>
