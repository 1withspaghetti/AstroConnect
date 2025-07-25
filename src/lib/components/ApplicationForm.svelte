<script lang="ts">
	import { ApplicationFormQuestionType, type ApplicationForm } from '@/types/applicationForm';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import Button from '@/components/ui/button/button.svelte';
	import { getApplicationFormSchema } from '@/validators/applicationFormValidator';

	let {
		formDefinition,
		formInputData,
		disabled = false,
		preventSubmit = false
	}: {
		formDefinition: ApplicationForm;
		formInputData?: SuperValidated<Infer<ReturnType<typeof getApplicationFormSchema>>>;
		disabled?: boolean;
		preventSubmit?: boolean;
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
		<Button type="submit" disabled={$submitting || disabled || preventSubmit}>
			{#if $submitting}
				<span>Submitting...</span>
			{:else}
				<span>Submit Application</span>
			{/if}
		</Button>
	</div>
</form>
