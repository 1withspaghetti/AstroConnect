<script lang="ts">
	import { descriptionEditFormSchema } from '@/validators/descriptionEditFormValidator';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import SelectCombobox from '@/components/ui/SelectCombobox.svelte';
	import { defaultCareerStageLevels } from '@/types/post';
	import Button from '@/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import { CalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { RangeCalendar } from '@/components/ui/range-calendar';
	import { IsMobile } from '@/hooks/is-mobile.svelte';
	import dayjs from '@/util/dayjs';
	import * as Select from '@/components/ui/select';
	import type { SessionUser, UserPreview } from '@/types/user';
	import TagMultiselectCombobox from '@/components/ui/TagMultiselectCombobox.svelte';
	import * as Popover from '@/components/ui/popover';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let {
		user,
		proxyAs,
		globalTags,
		userTags,
		formInputData
	}: {
		user: SessionUser;
		proxyAs: UserPreview[];
		globalTags: string[];
		userTags: string[];
		formInputData: SuperValidated<Infer<typeof descriptionEditFormSchema>>;
	} = $props();

	let form = superForm(formInputData, {
		validators: zod4Client(descriptionEditFormSchema),
		dataType: 'json',
		taintedMessage: true,
		resetForm: false,
		applyAction: 'never', // Prevents the other form submission from resetting this one
		onUpdated: ({ form }) =>
			form.message && toast[form.message.type](form.message.text, { duration: 3000 }),
		onError: ({ result }) =>
			toast.error(
				'Error submitting: ' + (result.error.message || 'Unknown error ' + result.status),
				{ duration: 3000 }
			)
	});

	const { form: formData, enhance, submitting, tainted } = form;

	const isMobile = new IsMobile();

	let postAsList = $derived(
		[{ id: user.id, label: `Yourself (${user.email})` }].concat(
			proxyAs.map((u) => ({ id: u.id, label: `${u.name} (${u.email})` }))
		)
	);

	// Ensure careerStage is always an array for consistency
	let fullCareerStageList = $derived(
		$formData.careerStage
			? defaultCareerStageLevels.includes($formData.careerStage)
				? defaultCareerStageLevels
				: [...defaultCareerStageLevels, $formData.careerStage]
			: defaultCareerStageLevels
	);

	let dateRangeOpen = $state(false);

	function getDateRange() {
		let start = undefined;
		let end = undefined;
		if ($formData.durationStart) {
			let startDate = dayjs($formData.durationStart, 'YYYY-MM-DD');
			start = new CalendarDate(startDate.year(), startDate.month() + 1, startDate.date());
		}
		if ($formData.durationEnd) {
			let endDate = dayjs($formData.durationEnd, 'YYYY-MM-DD');
			end = new CalendarDate(endDate.year(), endDate.month() + 1, endDate.date());
		}
		return {
			start,
			end
		};
	}

	function setDateRange(range: DateRange) {
		$formData.durationStart = range.start
			? dayjs(range.start.toString()).format('YYYY-MM-DD')
			: undefined;
		$formData.durationEnd = range.end
			? dayjs(range.end.toString()).format('YYYY-MM-DD')
			: undefined;
	}
</script>

<form method="POST" use:enhance action="?/description" class="mt-4 flex flex-col gap-6">
	<Form.Field {form} name="ownerId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Post As</Form.Label>
				<Select.Root type="single" bind:value={$formData.ownerId} name={props.name}>
					<Select.Trigger {...props}>
						{postAsList.find((u) => u.id === $formData.ownerId)?.label || 'Select User'}
					</Select.Trigger>
					<Select.Content>
						{#each postAsList as user (user.id)}
							<Select.Item value={user.id} label={user.label} />
						{/each}
					</Select.Content>
				</Select.Root>
				<Form.Description>
					Other users can add you as a proxy in their settings, allowing you to post on their
					behalf.
				</Form.Description>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Title</Form.Label>
				<Input {...props} bind:value={$formData.title} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="desc">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Textarea {...props} bind:value={$formData.desc} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="positions">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Positions Available (optional)</Form.Label>
				<Input {...props} bind:value={$formData.positions} placeholder="E.x. '1' or '5-6'" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="timeCommitment">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Time Commitment (optional)</Form.Label>
				<Input {...props} bind:value={$formData.timeCommitment} placeholder="E.x. '4hrs a week'" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="careerStage">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Career Stage (optional)</Form.Label>
				<SelectCombobox bind:item={$formData.careerStage} defaultOptions={fullCareerStageList} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="prereq">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Prerequisites (optional)</Form.Label>
				<Input {...props} bind:value={$formData.prereq} placeholder="E.x. 'Astro 322'" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="tags">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Tags (optional)</Form.Label>
				<TagMultiselectCombobox
					bind:tags={$formData.tags}
					{globalTags}
					{userTags}
					allowCustom
					placeholder="Search Tags"
					emptyText="No existing tags found"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="durationStart">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Estimated Date Range (optional)</Form.Label>
				<Popover.Root bind:open={dateRangeOpen}>
					<Popover.Trigger {...props}>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="w-[200px] justify-between font-normal">
								{$formData.durationStart && $formData.durationEnd
									? `${dayjs($formData.durationStart, 'YYYY-MM-DD').format('l')} - ${dayjs($formData.durationEnd, 'YYYY-MM-DD').format('l')}`
									: 'Select date'}
								<ChevronDownIcon />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto overflow-hidden p-0" align="start">
						<RangeCalendar
							bind:value={getDateRange, setDateRange}
							class="w-fit rounded-lg border shadow-sm"
							numberOfMonths={isMobile.current ? 1 : 2}
							captionLayout="dropdown"
						/>
					</Popover.Content>
				</Popover.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="flex justify-center gap-4">
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
