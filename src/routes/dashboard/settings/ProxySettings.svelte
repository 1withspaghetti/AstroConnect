<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import UserAvatar from '@/components/UserAvatar.svelte';
	import type { UserPreview } from '@/types/user';
	import { proxyUserSubmitSchema } from '@/validators/proxyUserSubmitValidator';
	import Trash from '@lucide/svelte/icons/trash';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '@/components/ui/input';
	import apiRequest from '@/util/apiClient';
	import { invalidateAll } from '$app/navigation';

	let {
		proxyUserFormInputData,
		proxyUsers
	}: {
		proxyUserFormInputData: SuperValidated<Infer<typeof proxyUserSubmitSchema>>;
		proxyUsers: UserPreview[];
	} = $props();

	let form = superForm(proxyUserFormInputData, {
		validators: zod4Client(proxyUserSubmitSchema),
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

	function deleteProxyUser(userId: string) {
		apiRequest('DELETE', '/dashboard/settings/proxy/' + encodeURIComponent(userId))
			.then(() => {
				toast.success(`Deleted proxy user successfully`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to delete proxy user: ' + err.message);
			});
	}
</script>

<Card.Root class="w-full max-w-lg">
	<Card.Header>
		<Card.Title>Proxy Users</Card.Title>
		<Card.Description>
			<Dialog.Root>
				<Dialog.Trigger class="cursor-pointer text-sm text-blue-500 underline"
					>What is a Proxy User?</Dialog.Trigger
				>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>What is a Proxy User?</Dialog.Title>
					</Dialog.Header>
					<ul class="list-disc pb-4 pl-5">
						<li>
							Proxy users can post, edit, and delete research opportunities (aka "Posts") on your
							behalf.
						</li>
						<li>They can read submissions made to those posts.</li>
						<li>
							They <strong>cannot</strong> access to your account settings or profile settings.
						</li>
						<li>They <strong>cannot</strong> submit applications on your behalf.</li>
					</ul>
					<Dialog.Footer>
						<Dialog.Close class={buttonVariants()}>Got It!</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#each proxyUsers as user (user.id)}
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<UserAvatar {user} />
					<div class="flex flex-col gap-0.5">
						<p class="text-sm leading-none font-medium">{user.name}</p>
						<p class="text-muted-foreground text-xs">{user.email}</p>
					</div>
				</div>
				<Button variant="destructive" size="icon" onclick={() => deleteProxyUser(user.id)}>
					<Trash class="size-4" />
				</Button>
			</div>
		{:else}
			<div class="text-sm text-muted-foreground">
				No proxy users have been added to your account.
			</div>
		{/each}
		<form method="POST" use:enhance action="?/proxy" class="mt-8 flex gap-2">
			<Form.Field {form} name="email" class="w-full">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>User Email</Form.Label>
						<Input {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Button type="submit" disabled={$submitting || !$tainted} class="mt-5.5">Add</Button>
		</form>
	</Card.Content>
</Card.Root>
