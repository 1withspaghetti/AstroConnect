<script lang="ts">
	import {
		fieldProxy,
		superForm,
		type FieldProxy,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms/client';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Button from './ui/button/button.svelte';
	import { applicationEditFormSchema } from '@/validators/applicationEditFormValidator';
	import * as Select from '$lib/components/ui/select';
	import {
		ApplicationFormQuestionType as QType,
		applicationFormQuestionTypes,
		type ApplicationFormQuestion,
		type SelectQuestion,
		type MultiSelectQuestion,
		type TextQuestion,
		type TextareaQuestion
	} from '@/types/applicationForm';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Textarea from './ui/textarea/textarea.svelte';
	import { Checkbox } from './ui/checkbox';
	import { flip } from 'svelte/animate';
	import MultiselectCombobox from './ui/MultiselectCombobox.svelte';

	let {
		formInputData
	}: {
		formInputData: SuperValidated<Infer<typeof applicationEditFormSchema>>;
	} = $props();

	let form = superForm(formInputData, {
		validators: zod4Client(applicationEditFormSchema),
		dataType: 'json',
		taintedMessage: true,
		onSubmit: async (e) => {
			formData.update(
				() => {
					return {
						questions: $formData.questions.map((q) => ({
							...q,
							id: getQuestionID(q.label)
						}))
					};
				},
				{ taint: false }
			);
		}
	});

	const { form: formData, enhance, submitting, tainted } = form;

	function getQuestionID(label: string, preventDuplicates = false): string {
		let id = label
			.replace(/\s+/g, '_')
			.replace(/[^\w]+/g, '')
			.toLowerCase();
		if (preventDuplicates) {
			const isDuplicate = $formData.questions.some((q) => getQuestionID(q.label) === id);
			if (isDuplicate) return getQuestionID(`${label} c`, true);
		}
		return id;
	}

	function moveUp(index: number) {
		if (index > 0) {
			const questions = $formData.questions;
			[questions[index - 1], questions[index]] = [questions[index], questions[index - 1]];
			formData.update(() => ({ questions }), { taint: true });
		}
	}

	function moveDown(index: number) {
		if (index < $formData.questions.length - 1) {
			const questions = $formData.questions;
			[questions[index + 1], questions[index]] = [questions[index], questions[index + 1]];
			formData.update(() => ({ questions }), { taint: true });
		}
	}
</script>

<form method="POST" use:enhance class="flex flex-col gap-8">
	<Form.Fieldset {form} name="questions" class="space-y-4">
		<Form.Legend class="sr-only">Application Questions</Form.Legend>
		{#each $formData.questions as _, i (_.id)}
			{@const question = fieldProxy(form, `questions[${i}]`) as FieldProxy<ApplicationFormQuestion>}

			<div animate:flip={{ duration: 300 }} class="flex items-start gap-2">
				<div class="flex flex-col items-center justify-center">
					<Button
						variant="ghost"
						size="icon"
						class="size-8"
						disabled={i === 0}
						onclick={() => moveUp(i)}
					>
						<ChevronUp />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="size-8"
						disabled={i === $formData.questions.length - 1}
						onclick={() => moveDown(i)}
					>
						<ChevronDown />
					</Button>
				</div>
				<div class="flex w-full flex-col gap-2">
					<div class="flex w-full items-center gap-2">
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
										onValueChange={(value) =>
											($formData.questions[i].type = parseInt(value || '0'))}
									>
										<Select.Trigger class="w-42">
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
					<div class="flex w-full items-start gap-4">
						<Form.Field name="questions[{i}].required" {form}>
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Required</Form.Label>
									<div class="flex h-9 items-center justify-center">
										<Checkbox
											{...props}
											bind:checked={$formData.questions[i].required}
											class="size-5 cursor-pointer"
										/>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						{#if $formData.questions[i].type === QType.SELECT || $formData.questions[i].type === QType.MULTISELECT}
							<Form.Field name="questions[{i}].options" {form} class="w-full">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Options</Form.Label>
										<MultiselectCombobox
											{...props}
											items={'options' in $formData.questions[i]
												? $formData.questions[i].options
												: []}
											onChange={(items) => {
												($formData.questions[i] as SelectQuestion | MultiSelectQuestion).options =
													items || undefined;
											}}
											defaultOptions={'options' in $formData.questions[i]
												? $formData.questions[i].options
												: []}
											allowCustom={true}
											placeholder="Add Options"
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						{:else}
							<div class="w-full"></div>
						{/if}
						{#if $formData.questions[i].type === QType.TEXT || $formData.questions[i].type === QType.TEXTAREA || $formData.questions[i].type === QType.MULTISELECT}
							<Form.Field name="questions[{i}].min" {form} class="w-32">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label
											>Min {$formData.questions[i].type === QType.MULTISELECT
												? 'Options'
												: 'Chars'}</Form.Label
										>
										<Input
											type="number"
											{...props}
											value={(
												$formData.questions[i] as
													| TextQuestion
													| TextareaQuestion
													| MultiSelectQuestion
											).min}
											oninput={(e) => {
												(
													$formData.questions[i] as
														| TextQuestion
														| TextareaQuestion
														| MultiSelectQuestion
												).min = e.currentTarget.valueAsNumber || undefined;
											}}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field name="questions[{i}].max" {form} class="w-32">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label
											>Max {$formData.questions[i].type === QType.MULTISELECT
												? 'Options'
												: 'Chars'}</Form.Label
										>
										<Input
											type="number"
											{...props}
											value={(
												$formData.questions[i] as
													| TextQuestion
													| TextareaQuestion
													| MultiSelectQuestion
											).max}
											oninput={(e) => {
												(
													$formData.questions[i] as
														| TextQuestion
														| TextareaQuestion
														| MultiSelectQuestion
												).max = e.currentTarget.valueAsNumber || undefined;
											}}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						{/if}
					</div>
					<div class="flex w-full items-center gap-2">
						<Form.Field name="questions[{i}].desc" {form} class="w-full">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Description</Form.Label>
									<Textarea {...props} bind:value={$formData.questions[i].desc} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
			</div>
		{/each}
	</Form.Fieldset>
	<div class="mt-4 flex justify-center gap-4">
		<Button type="submit" disabled={$submitting || !$tainted}>Save</Button>
		<Button
			type="reset"
			variant="secondary"
			disabled={$submitting || !$tainted}
			onclick={(e) => {
				e.preventDefault();
				form.reset();
			}}
		>
			Reset
		</Button>
	</div>
</form>
