<script lang="ts">
	import DescriptionEditForm from './DescriptionEditForm.svelte';
	import type { PageProps } from './$types';
	import Meta from '@/components/Meta.svelte';

	let { data }: PageProps = $props();
</script>

<Meta title="Edit Description" />

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<DescriptionEditForm
		postId={data.postId}
		user={data.user}
		proxyAs={data.proxyAs}
		images={data.images}
		postTags={data.postTags}
		formInputData={data.form}
	/>
</div>
