<script lang="ts">
	import DescriptionEditForm from '@/components/DescriptionEditForm.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<DescriptionEditForm postId={data.postId} images={data.images} formInputData={data.form} />
</div>
