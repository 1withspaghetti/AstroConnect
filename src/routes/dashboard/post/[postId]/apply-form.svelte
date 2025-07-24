<script lang="ts">
	import { ApplicationFormQuestionType, type ApplicationForm } from '@/types/applicationForm';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getApplicationFormSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';

	let {
		formDefinition,
		formInputData
	}: {
		formDefinition: ApplicationForm;
		formInputData: SuperValidated<Infer<ReturnType<typeof getApplicationFormSchema>>>;
	} = $props();

	let form = superForm(formInputData, {
		validators: zodClient(getApplicationFormSchema(formDefinition))
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance>
	{#each formDefinition.questions as question}
		{#if question.type === ApplicationFormQuestionType.TEXT}
			<Form.Field {form} name={question.id}>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{question.label}</Form.Label>
						<Input {...props} bind:value={$formData[question.id]} />
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
						<Form.Label>{question.label}</Form.Label>
						<Textarea {...props} bind:value={$formData[question.id]} />
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
						<Form.Label>{question.label}</Form.Label>
						<Select.Root
							type={question.multiple ? 'multiple' : 'single'}
							bind:value={$formData[question.id]}
							name={props.name}
						>
							<Select.Trigger {...props}>
								{$formData[question.id] ? $formData[question.id] : 'Select'}
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
</form>
