<script lang="ts">
	import { acceptingResponsesFormSchema } from '@/validators/acceptingResponsesFormValidator';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '@/components/ui/checkbox';
	import * as Popover from '@/components/ui/popover';
	import { cn } from '@/utils';
	import { buttonVariants } from '@/components/ui/button';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { Calendar } from '@/components/ui/calendar';
	import { type DateValue, getLocalTimeZone, fromDate, today } from '@internationalized/date';
	import dayjs from '@/util/dayjs';
	import { Input } from '@/components/ui/input';
	import Button from '@/components/ui/button/button.svelte';

	let {
		formInputData
	}: {
		formInputData: SuperValidated<Infer<typeof acceptingResponsesFormSchema>>;
	} = $props();

	let form = superForm(formInputData, {
		validators: zod4Client(acceptingResponsesFormSchema),
		dataType: 'json',
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

	const { form: formData, enhance, submitting, tainted } = form;

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
</script>

<form use:enhance method="POST" class="flex flex-wrap items-start justify-center gap-2">
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
				<div class="flex items-center gap-2">
					<Checkbox
						{...props}
						bind:checked={closesAtChecked}
						disabled={!$formData.isOpen}
						class="size-5"
					/>
					<Form.Label>Closes&nbsp;At:</Form.Label>
					<Popover.Root>
						<Popover.Trigger
							{...props}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-48 justify-start pl-4 text-left font-normal',
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
						class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
					/>
				</div>
				<Form.FieldErrors />
				<input hidden value={closesAtChecked && $formData.closesAt} name={props.name} />
			{/snippet}
		</Form.Control>
	</Form.Field>
	<Button type="submit" disabled={$submitting || !$tainted}>Save</Button>
</form>
