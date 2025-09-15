<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '@/components/ui/button';
	import Trash from '@lucide/svelte/icons/trash';
	import { superForm } from 'sveltekit-superforms';
	import { defaultTagSchema } from '@/validators/defaultTagValidator';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '@/components/ui/input';
	import apiRequest from '@/util/apiClient';
	import { invalidateAll } from '$app/navigation';
	import X from '@lucide/svelte/icons/x';

	let { data }: PageProps = $props();

	let form = superForm(data.defaultTagForm, {
		validators: zod4Client(defaultTagSchema),
		taintedMessage: false,
		resetForm: true,
		onUpdated: ({ form }) =>
			form.message && toast[form.message.type](form.message.text, { duration: 3000 }),
		onError: ({ result }) =>
			toast.error(
				'Error submitting: ' + (result.error.message || 'Unknown error ' + result.status),
				{ duration: 3000 }
			)
	});

	let { form: formData, enhance, submitting, tainted } = form;

	function deleteTag(tag: string) {
		apiRequest('DELETE', '/dashboard/admin/tags/' + encodeURIComponent(tag))
			.then(() => {
				toast.success(`Deleted tag successfully`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to delete tag: ' + err.message);
			});
	}
</script>

<Meta title="Default Tags" />

<div class="flex flex-col items-center p-4 pb-16">
	<Card.Root class="mt-16 w-full max-w-lg">
		<Card.Header>
			<Card.Title>Default Tags</Card.Title>
			<Card.Description>
				This list of tags will be the first options users see when creating or searching for tags.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#each data.tags as tag (tag)}
				<div class="flex items-center justify-between gap-4">
					<div class="flex items-center gap-4">
						<p class="font-medium">{tag}</p>
					</div>
					<Button variant="ghost" size="icon" onclick={() => deleteTag(tag)}>
						<X class="text-destructive size-4" />
					</Button>
				</div>
			{:else}
				<div class="text-sm text-muted-foreground">No default tags have been added.</div>
			{/each}
			<form method="POST" use:enhance class="mt-8 flex gap-2">
				<Form.Field {form} name="tag" class="w-full">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Tag</Form.Label>
							<Input {...props} bind:value={$formData.tag} autofocus />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Button type="submit" disabled={$submitting || !$tainted} class="mt-5.5">Add</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
