<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Button from './ui/button/button.svelte';
	import { applicationEditFormSchema } from '@/validators/applicationEditFormValidator';
	import * as Select from '$lib/components/ui/select';
	import { applicationFormQuestionTypes } from '@/types/applicationForm';

	let {
		formInputData
	}: {
		formInputData: SuperValidated<Infer<typeof applicationEditFormSchema>>;
	} = $props();

	let form = superForm(formInputData, {
		validators: zod4Client(applicationEditFormSchema),
		dataType: 'json',
		taintedMessage: true
	});

	const { form: formData, enhance, submitting, tainted } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
	<Form.Fieldset {form} name="questions">
		{#each $formData.questions as _, i}
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<Form.Field name="questions[{i}].label" {form} class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Question {i + 1}</Form.Label>
								<Input {...props} bind:value={$formData.questions[i].label} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field name="questions[{i}].type" {form}>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Type</Form.Label>
								<Select.Root
									{...props}
									type="single"
									name={`questions[${i}].type`}
									value={$formData.questions[i].type + ''}
									onValueChange={(value) => ($formData.questions[i].type = parseInt(value || '0'))}
								>
									<Select.Trigger class="w-[180px]">
										{applicationFormQuestionTypes[$formData.questions[i].type]}
									</Select.Trigger>
									<Select.Content>
										{#each Object.entries(applicationFormQuestionTypes) as [value, label] (value)}
											<Select.Item {value} {label} />
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
		{/each}
	</Form.Fieldset>
	<div class="mt-4 flex justify-center gap-4">
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
