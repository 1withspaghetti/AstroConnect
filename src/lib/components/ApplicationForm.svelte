<script lang="ts">
	import { ApplicationFormQuestionType, type ApplicationForm } from '@/types/applicationForm';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms/client';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { getApplicationFormSchema } from '@/validators/applicationFormValidator';
	import Button from './ui/button/button.svelte';

	let {
		formDefinition,
		formInputData,
		disabled = false,
		allowSubmit = false
	}: {
		formDefinition: ApplicationForm;
		formInputData?: SuperValidated<Infer<ReturnType<typeof getApplicationFormSchema>>>;
		disabled?: boolean;
		allowSubmit?: boolean;
	} = $props();

	let form = superForm(formInputData || {}, {
		validators: zod4Client(getApplicationFormSchema(formDefinition))
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
	{#each formDefinition.questions as question}
		{#if question.type === ApplicationFormQuestionType.TEXT}
			<Form.Field {form} name={question.id}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>
							{question.label}
							{#if question.required}
								<span class="text-red-500">*</span>
							{/if}
						</Form.Label>
						<Input {...props} {disabled} bind:value={$formData[question.id]} />
					{/snippet}
				</Form.Control>
				{#if question.desc}
					<Form.Description>{question.desc}</Form.Description>
				{/if}
				<Form.FieldErrors />
			</Form.Field>
		{:else if question.type === ApplicationFormQuestionType.TEXTAREA}
			<Form.Field {form} name={question.id}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>
							{question.label}
							{#if question.required}
								<span class="text-red-500">*</span>
							{/if}
						</Form.Label>
						<Textarea {...props} {disabled} bind:value={$formData[question.id]} />
					{/snippet}
				</Form.Control>
				{#if question.desc}
					<Form.Description>{question.desc}</Form.Description>
				{/if}
				<Form.FieldErrors />
			</Form.Field>
		{:else if question.type === ApplicationFormQuestionType.SELECT}
			<Form.Field {form} name={question.id}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>
							{question.label}
							{#if question.required}
								<span class="text-red-500">*</span>
							{/if}
						</Form.Label>
						<Select.Root
							type="single"
							{disabled}
							bind:value={$formData[question.id]}
							name={props.name}
						>
							<Select.Trigger {...props} class="w-full">
								{$formData[question.id] ? $formData[question.id] : 'Select...'}
							</Select.Trigger>
							<Select.Content>
								{#each question.options.split(',') as option}
									<Select.Item value={option} label={option} />
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				{#if question.desc}
					<Form.Description>{question.desc}</Form.Description>
				{/if}
				<Form.FieldErrors />
			</Form.Field>
		{:else if question.type === ApplicationFormQuestionType.MULTISELECT}
			<Form.Field {form} name={question.id}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>
							{question.label}
							{#if question.required}
								<span class="text-red-500">*</span>
							{/if}
						</Form.Label>
						<Select.Root
							type="multiple"
							{disabled}
							bind:value={$formData[question.id]}
							name={props.name}
						>
							<Select.Trigger {...props} class="w-full">
								{$formData[question.id]?.length > 0
									? $formData[question.id].join(', ')
									: 'Select Multiple...'}
							</Select.Trigger>
							<Select.Content>
								{#each question.options.split(',') as option}
									<Select.Item value={option} label={option} />
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				{#if question.desc}
					<Form.Description>{question.desc}</Form.Description>
				{/if}
				<Form.FieldErrors />
			</Form.Field>
		{:else if question.type === ApplicationFormQuestionType.FILE}
			<span>File Upload (todo)</span>
		{/if}
	{/each}
	<div class="flex justify-center">
		<Tooltip.Provider>
			<Tooltip.Root disabled={!($submitting || disabled || !allowSubmit)}>
				<Tooltip.Trigger>
					<Button type="submit" disabled={$submitting || disabled || !allowSubmit}>
						{#if $submitting}
							<span>Submitting...</span>
						{:else}
							<span>Submit Application</span>
						{/if}
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>
						{#if $submitting}
							Please wait while your application is being submitted.
						{:else if disabled}
							This application is not accepting submissions.
						{:else if !allowSubmit}
							You cannot submit the form while previewing it.
						{:else}
							Click to email your application to
						{/if}
					</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
</form>
