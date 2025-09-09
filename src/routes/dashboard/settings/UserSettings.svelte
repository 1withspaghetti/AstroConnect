<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import { settingsEditSchema } from '@/validators/settingsEditValidator';
	import { Switch } from '@/components/ui/switch';
	import { toast } from 'svelte-sonner';
	import type { SessionUser } from '@/types/user';

	let {
		userSettingsFormInputData,
		user
	}: {
		userSettingsFormInputData: SuperValidated<Infer<typeof settingsEditSchema>>;
		user: SessionUser;
	} = $props();

	let form = superForm(userSettingsFormInputData, {
		validators: zod4Client(settingsEditSchema),
		taintedMessage: true,
		resetForm: false,
		onUpdated: ({ form }) =>
			form.message && toast[form.message.type](form.message.text, { duration: 3000 }),
		onError: ({ result }) =>
			toast.error(
				'Error submitting: ' + (result.error.message || 'Unknown error ' + result.status),
				{ duration: 3000 }
			)
	});

	let { form: formData, enhance, submitting, tainted } = form;
</script>

<Card.Root class="w-full max-w-lg">
	<Card.Header>
		<Card.Title>User Settings</Card.Title>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance action="?/update" class="flex flex-col gap-6">
			<Form.Field {form} name="sendSubmissionEmails">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex w-full flex-row items-center justify-between gap-4">
							<div class="space-y-0.5">
								<Form.Label>Send Submission Emails</Form.Label>
								<Form.Description>
									Should emails be sent to your email when someone submits to one of your research
									opportunities?
								</Form.Description>
							</div>
							<Switch {...props} bind:checked={$formData.sendSubmissionEmails} />
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="space-y-2">
				<Label>Email</Label>
				<Input disabled value={user.email} class="disabled:bg-accent disabled:opacity-100" />
				<div class="text-muted-foreground text-sm">
					This cannot be changed because it is connected to the account you used to sign up.
				</div>
			</div>
			<Form.Field {form} name="alternateEmail">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Alternate Receiving Email</Form.Label>
						<Input {...props} bind:value={$formData.alternateEmail} />
						<Form.Description>
							A personal or alternate email where submissions to your posts will be sent. Will
							default to your account email if left blank.
						</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex gap-2">
				<Button type="submit" disabled={$submitting || !$tainted}>Save</Button>
				<Button
					type="reset"
					variant="secondary"
					disabled={!$tainted}
					onclick={(e) => {
						e.preventDefault();
						form.reset();
					}}
				>
					Reset
				</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
