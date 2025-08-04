<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import { settingsEditSchema } from '@/validators/settingsEditSchema';
	import * as Select from '@/components/ui/select';
	import { MediaQuery } from 'svelte/reactivity';

	const isSystemDark = new MediaQuery('prefers-color-scheme: dark', true);

	let { data }: PageProps = $props();

	let form = superForm(data.form, {
		validators: zod4Client(settingsEditSchema),
		taintedMessage: true
	});

	let { form: formData, enhance, submitting, tainted } = form;

	const modeOptions = [
		{
			value: 'light',
			label: 'Light'
		},
		{
			value: 'dark',
			label: 'Dark'
		},
		{
			value: 'system',
			label: 'System'
		}
	];

	let mode = $state('system');
	$effect(() => {
		mode = modeOptions.find((f) => f.value === localStorage.getItem('mode'))?.value || 'system';
	});
	$effect(() => {
		if (mode === 'light') document.documentElement.classList.remove('dark');
		else if (mode === 'dark') document.documentElement.classList.add('dark');
		else document.documentElement.classList[isSystemDark ? 'add' : 'remove']('dark');
		localStorage.setItem('mode', mode);
	});
</script>

<div class="flex flex-col items-center p-4 pb-16">
	<Card.Root class="mt-32 w-full max-w-lg">
		<Card.Header>
			<Card.Title>Settings & Preferences</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="flex flex-col gap-6">
				<div class="space-y-2">
					<Label>App Appearance</Label>
					<Select.Root type="single" bind:value={mode}>
						<Select.Trigger>
							{modeOptions.find((f) => f.value === mode)?.label ?? 'Select an option'}
						</Select.Trigger>
						<Select.Content>
							{#each modeOptions as option}
								<Select.Item value={option.value} label={option.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<Form.Field {form} name="receivingEmail">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Submission Receiving Email</Form.Label>
							<Input {...props} bind:value={$formData.receivingEmail} />
							<Form.Description>
								A personal or alternate email where submissions to your posts will be sent.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</form>
		</Card.Content>
		<Card.Footer>
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
		</Card.Footer>
	</Card.Root>
</div>
