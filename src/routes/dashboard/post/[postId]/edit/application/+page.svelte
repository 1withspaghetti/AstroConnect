<script lang="ts">
	import type { PageProps } from './$types';
	import ApplicationEditForm from '@/components/ApplicationEditForm.svelte';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<ApplicationEditForm formInputData={data.form} />
</div>
