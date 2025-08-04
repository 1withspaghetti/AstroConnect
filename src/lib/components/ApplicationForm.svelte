<script lang="ts">
	import {
		ApplicationFormQuestionType,
		type ApplicationFormQuestion
	} from '@/types/applicationForm';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { getApplicationFormSchema } from '@/validators/applicationFormValidator';
	import Button from './ui/button/button.svelte';

	let {
		formQuestions,
		formInputData,
		disabled = false,
		allowSubmit = false
	}: {
		formQuestions: ApplicationFormQuestion[];
		formInputData?: SuperValidated<Infer<ReturnType<typeof getApplicationFormSchema>>>;
		disabled?: boolean;
		allowSubmit?: boolean;
	} = $props();

	let form = superForm(formInputData || {}, {
		validators: zod4Client(getApplicationFormSchema(formQuestions))
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
	{#each formQuestions as question}
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
								{#each question.options as option}
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
								{#each question.options as option}
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
		<Button type="submit" disabled={$submitting || disabled || !allowSubmit}>
			{#if $submitting}
				<span>Submitting...</span>
			{:else if disabled}
				<span>Submissions Closed</span>
			{:else}
				<span>Submit</span>
			{/if}
		</Button>
	</div>
</form>
