<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { searchSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Search from '@lucide/svelte/icons/search';

	let { data }: { data: { form: SuperValidated<Infer<typeof searchSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(searchSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form
	method="POST"
	use:enhance
	class="flex w-full items-start justify-center gap-2"
	aria-label="Search Form"
>
	<Form.Field {form} name="query" class="w-full max-w-lg">
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.query} placeholder="Search" class="h-10" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button size="lg"><Search /></Form.Button>
</form>
