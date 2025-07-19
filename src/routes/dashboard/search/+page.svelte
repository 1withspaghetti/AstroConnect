<script lang="ts">
	import type { PageProps } from './$types';
	import SearchForm from './search-form.svelte';
	import ResearchList from './research-list.svelte';

	let { data }: PageProps = $props();
</script>

<div class="container mx-auto">
	<div class="relative mb-16 w-full">
		<enhanced:img
			alt="Starry Mountain Background"
			class="max-h-32 w-full object-cover object-center"
			src="$lib/assets/imgs/benjamin-voros-phIFdC6lA4E-unsplash.jpg"
			sizes="(max-width: 1920px) 100vw"
		/>
		<div class="absolute right-0 bottom-0 bg-black/50 px-2 py-1 text-xs text-white">
			Photo by <a
				href="https://unsplash.com/@vorosbenisop?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				>Benjamin Voros</a
			>
			on
			<a
				href="https://unsplash.com/photos/snow-mountain-under-stars-phIFdC6lA4E?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
				>Unsplash</a
			>
		</div>
		<div class="absolute bottom-0 left-0 w-full translate-y-1/2">
			<SearchForm {data} />
		</div>
	</div>
	<ResearchList items={data.researchOpportunities} />
</div>
