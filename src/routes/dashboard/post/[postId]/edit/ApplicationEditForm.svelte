<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Button from '@/components/ui/button/button.svelte';
	import { applicationEditFormSchema } from '@/validators/applicationEditFormValidator';
	import * as Select from '$lib/components/ui/select';
	import {
		ApplicationFormQuestionType as QType,
		applicationFormQuestionTypes,
		type SelectQuestion,
		type MultiSelectQuestion,
		type TextQuestion,
		type TextareaQuestion
	} from '@/types/applicationForm';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash from '@lucide/svelte/icons/trash';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import { flip } from 'svelte/animate';
	import MultiselectCombobox from '@/components/ui/MultiselectCombobox.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import { toast } from 'svelte-sonner';
	import { tick } from 'svelte';
	import { cn } from '@/utils';
	import { buttonVariants } from '@/components/ui/button';
	import * as Popover from '@/components/ui/popover';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { Calendar } from '@/components/ui/calendar';
	import { type DateValue, getLocalTimeZone, fromDate, today } from '@internationalized/date';
	import dayjs from '@/util/dayjs';

	let {
		formInputData
	}: {
		formInputData: SuperValidated<Infer<typeof applicationEditFormSchema>>;
	} = $props();

	let form = superForm(formInputData, {
		validators: zod4Client(applicationEditFormSchema),
		dataType: 'json',
		taintedMessage: true,
		resetForm: false,
		applyAction: 'never', // Prevents the other form submission from resetting this one
		onSubmit: async (e) => {
			formData.update(
				() => {
					return {
						...$formData,
						questions: $formData.questions.map((q, i) => ({
							...q,
							id: getQuestionID(q.label, i)
						}))
					};
				},
				{ taint: false }
			);
		},
		onUpdated: ({ form }) =>
			form.message && toast[form.message.type](form.message.text, { duration: 3000 }),
		onError: ({ result }) =>
			toast.error(
				'Error submitting: ' + (result.error.message || 'Unknown error ' + result.status),
				{ duration: 3000 }
			)
	});

	const { form: formData, enhance, submitting, tainted } = form;

	// closesAt

	let closesAtChecked = $state($formData.closesAt !== undefined);
	let closesAtDate = $state<DateValue | undefined>(
		$formData.closesAt ? fromDate($formData.closesAt, getLocalTimeZone()) : undefined
	);
	let closesAtTime = $state<string | undefined>(
		$formData.closesAt ? dayjs($formData.closesAt).format('HH:mm') : '23:59'
	);
	$effect(() => {
		if (closesAtChecked && closesAtDate) {
			let [hours, minutes] = (closesAtTime || '23:59').split(':').map(Number);
			let date = closesAtDate.toDate(getLocalTimeZone());
			date.setHours(hours, minutes, 0, 0);
			$formData.closesAt = date;
		} else {
			$formData.closesAt = undefined;
		}
	});

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	// maxSlots

	let closesAfterApplicationsChecked = $state($formData.maxSlots !== undefined);
	let maxSlotsInput = $state<number | undefined>($formData.maxSlots);

	$effect(() => {
		if (closesAfterApplicationsChecked && maxSlotsInput !== undefined) {
			$formData.maxSlots = maxSlotsInput;
		} else {
			$formData.maxSlots = undefined;
		}
	});

	// Questions

	function getQuestionID(label: string, ignoreSelf?: number): string {
		let id = label
			.replace(/\s+/g, '_')
			.replace(/[^\w]+/g, '')
			.toLowerCase();
		while ($formData.questions.some((q, i) => q.id === id && i !== ignoreSelf)) {
			id += '_c';
		}
		return id;
	}

	function createQuestion() {
		const newQuestion = {
			id: getQuestionID(`New Question`),
			label: `New Question`,
			desc: '',
			required: true,
			type: QType.TEXT
		} as TextQuestion;
		formData.update((form) => ({ ...form, questions: [...$formData.questions, newQuestion] }), {
			taint: true
		});
	}

	function moveUp(index: number) {
		if (index > 0) {
			const questions = $formData.questions;
			[questions[index - 1], questions[index]] = [questions[index], questions[index - 1]];
			formData.update((form) => ({ ...form, questions }), { taint: true });
		}
	}

	function moveDown(index: number) {
		if (index < $formData.questions.length - 1) {
			const questions = $formData.questions;
			[questions[index + 1], questions[index]] = [questions[index], questions[index + 1]];
			formData.update((form) => ({ ...form, questions }), { taint: true });
		}
	}

	function duplicate(index: number) {
		const question = $formData.questions[index];
		const newQuestion = { ...question, id: getQuestionID(question.label) };
		formData.update(
			(form) => ({
				...form,
				questions: [
					...$formData.questions.slice(0, index + 1),
					newQuestion,
					...$formData.questions.slice(index + 1)
				]
			}),
			{ taint: true }
		);
	}

	function remove(index: number) {
		formData.update(
			(form) => ({ ...form, questions: $formData.questions.filter((_, i) => i !== index) }),
			{
				taint: true
			}
		);
	}
</script>

<form method="POST" use:enhance action="?/application" class="flex flex-col">
	<div class="mb-4 flex flex-wrap items-start justify-center gap-2">
		<Form.Field {form} name="isOpen" class="mr-6">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex h-9 items-center gap-2">
						<Checkbox {...props} bind:checked={$formData.isOpen} class="size-5" />
						<Form.Label>Accepting Responses</Form.Label>
					</div>
					<Form.FieldErrors />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="closesAt" class="mr-6">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-wrap items-center justify-center gap-2">
						<div class="flex items-center gap-2">
							<Checkbox
								bind:checked={closesAtChecked}
								disabled={!$formData.isOpen}
								class="size-5"
							/>
							<Form.Label>Closes&nbsp;At:</Form.Label>
						</div>
						<Popover.Root>
							<Popover.Trigger
								{...props}
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-42 justify-start pl-4 text-left font-normal',
									!closesAtDate && 'text-muted-foreground'
								)}
								disabled={!closesAtChecked || !$formData.isOpen}
							>
								{closesAtDate
									? dayjs(closesAtDate.toDate(getLocalTimeZone())).format('LL')
									: 'Pick a date'}
								<CalendarIcon class="ml-auto size-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									bind:placeholder
									bind:value={closesAtDate}
									minValue={today(getLocalTimeZone())}
									maxValue={today(getLocalTimeZone()).add({ years: 1 })}
									calendarLabel="Closing Date"
									disabled={!closesAtChecked || !$formData.isOpen}
								/>
							</Popover.Content>
						</Popover.Root>
						<Input
							type="time"
							id="{props.id}-time"
							bind:value={closesAtTime}
							disabled={!closesAtChecked || !$formData.isOpen}
							class="bg-background w-min appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
						/>
					</div>
					<Form.FieldErrors />
					<input hidden value={closesAtChecked && $formData.closesAt} name={props.name} />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="maxSlots" class="mr-6">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex items-center gap-2">
						<Checkbox
							bind:checked={closesAfterApplicationsChecked}
							disabled={!$formData.isOpen}
							class="size-5"
						/>
						<Form.Label>Closes after</Form.Label>
						<Input
							{...props}
							type="number"
							min="1"
							bind:value={maxSlotsInput}
							disabled={!closesAfterApplicationsChecked || !$formData.isOpen}
							class="w-20"
						/>
						<Form.Label>
							application{#if maxSlotsInput !== 1}s{/if}
						</Form.Label>
					</div>
					<Form.FieldErrors />
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>
	<Form.Fieldset {form} name="questions" class="space-y-8">
		<Form.Legend class="sr-only">Application Questions</Form.Legend>
		{#each $formData.questions as _, i (_.id)}
			<div animate:flip={{ duration: 300 }} class="flex items-start gap-2">
				<div class="flex flex-col items-center justify-center">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						class="size-8"
						disabled={i === 0}
						onclick={() => moveUp(i)}
					>
						<span class="sr-only">Move Up</span>
						<ChevronUp />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						class="size-8"
						disabled={i === $formData.questions.length - 1}
						onclick={() => moveDown(i)}
					>
						<span class="sr-only">Move Down</span>
						<ChevronDown />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						class="size-8"
						onclick={() => duplicate(i)}
					>
						<span class="sr-only">Duplicate Question</span>
						<Copy />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						class="text-destructive hover:text-destructive size-8"
						onclick={() => remove(i)}
					>
						<span class="sr-only">Remove Question</span>
						<Trash />
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
									<Form.Label>Required?</Form.Label>
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
									<Form.Label>Question Description</Form.Label>
									<Textarea {...props} bind:value={$formData.questions[i].desc} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
			</div>
		{/each}
		<Button
			type="button"
			variant="ghost"
			size="sm"
			class="bg-accent text-accent-foreground hover:bg-accent/80 h-16 w-full"
			onclick={() => tick().then(createQuestion)}
		>
			<Plus />
			<span>New Question</span>
		</Button>
	</Form.Fieldset>
	<div class="mt-6 flex justify-center gap-4">
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
