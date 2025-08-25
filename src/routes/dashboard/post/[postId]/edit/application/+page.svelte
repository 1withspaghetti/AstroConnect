<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import ApplicationEditForm from './ApplicationEditForm.svelte';

	let { data }: PageProps = $props();
</script>

<Meta title="Edit Application" />

<div class="mx-auto w-full max-w-4xl px-4 pb-16">
	<ApplicationEditForm formInputData={data.form} />
</div>
