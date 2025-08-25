<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import { settingsEditSchema } from '@/validators/settingsEditValidator';
	import * as Select from '@/components/ui/select';
	import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
	import { Switch } from '@/components/ui/switch';
	import { Separator } from '@/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import Meta from '@/components/Meta.svelte';

	let { data }: PageProps = $props();

	let form = superForm(data.form, {
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

<Meta title="Settings" />

<div class="flex flex-col items-center p-4 pb-16">
	<Card.Root class="mt-32 w-full max-w-lg">
		<Card.Header>
			<Card.Title>Settings & Preferences</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="flex flex-col gap-6">
				<div class="space-y-2">
					<Label>App Appearance</Label>
					<Select.Root
						type="single"
						value={userPrefersMode.current}
						onValueChange={(value) => {
							if (value === 'system') resetMode();
							else setMode(value as 'light' | 'dark');
						}}
					>
						<Select.Trigger>
							{userPrefersMode.current === 'system'
								? 'System Default'
								: userPrefersMode.current == 'dark'
									? 'Dark Mode'
									: 'Light Mode'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="light" label="Light Mode" />
							<Select.Item value="dark" label="Dark Mode" />
							<Select.Item value="system" label="System Default" />
						</Select.Content>
					</Select.Root>
					<div class="text-muted-foreground text-sm">
						This is just saved on this device and will not affect other devices.
					</div>
				</div>
				<Separator class="my-4" />
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
					<Input disabled value={data.user.email} class="disabled:bg-accent disabled:opacity-100" />
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
</div>
