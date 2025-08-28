<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import AcceptingResponsesForm from './AcceptingResponsesForm.svelte';

	let { data }: PageProps = $props();
</script>

<Meta title="Responses" />

<div class="container mx-auto flex flex-col items-center px-4 pb-16">
	<AcceptingResponsesForm formInputData={data.form} />
</div>
