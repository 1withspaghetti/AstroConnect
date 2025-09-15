<script lang="ts">
	import { page } from '$app/state';
	import { Input } from '@/components/ui/input';
	import Search from '@lucide/svelte/icons/search';
	import { Label } from '@/components/ui/label';
	import * as Select from '@/components/ui/select';
	import MultiselectCombobox from '@/components/ui/MultiselectCombobox.svelte';
	import { defaultCareerStageLevels } from '@/types/post';
	import { goto } from '$app/navigation';
	import dayjs from '@/util/dayjs';
	import { CalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { RangeCalendar } from '@/components/ui/range-calendar';
	import { IsMobile } from '@/hooks/is-mobile.svelte';
	import * as Popover from '@/components/ui/popover';
	import { Button } from '@/components/ui/button';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import TagMultiselectCombobox from '@/components/ui/TagMultiselectCombobox.svelte';

	let { globalTags, userTags }: { globalTags: string[]; userTags: string[] } = $props();

	let formRef = $state<HTMLFormElement>(null!);
	const isMobile = new IsMobile();

	let search = $state(page.url.searchParams.get('search') || '');
	let tags = $state(page.url.searchParams.get('tags')?.split(';') || []);
	let careerStage = $state(page.url.searchParams.get('careerStage')?.split(';') || []);
	let durationStart = $state(page.url.searchParams.get('start') || undefined);
	let durationEnd = $state(page.url.searchParams.get('end') || undefined);
	let orderBy = $state(page.url.searchParams.get('orderBy') || 'relevance');
	let order = $state(page.url.searchParams.get('order') || 'desc');

	let dateRangeOpen = $state(false);

	function getDateRange() {
		let start = undefined;
		let end = undefined;
		if (durationStart) {
			let startDate = dayjs(durationStart, 'YYYY-MM-DD');
			start = new CalendarDate(startDate.year(), startDate.month() + 1, startDate.date());
		}
		if (durationEnd) {
			let endDate = dayjs(durationEnd, 'YYYY-MM-DD');
			end = new CalendarDate(endDate.year(), endDate.month() + 1, endDate.date());
		}
		return {
			start,
			end
		};
	}

	function setDateRange(range: DateRange) {
		durationStart = range.start ? dayjs(range.start.toString()).format('YYYY-MM-DD') : undefined;
		durationEnd = range.end ? dayjs(range.end.toString()).format('YYYY-MM-DD') : undefined;
	}

	let fullCareerStageList = $derived(
		careerStage.concat(defaultCareerStageLevels.filter((custom) => !careerStage.includes(custom)))
	);

	const orderOptions = [
		{ value: 'asc', label: 'Ascending' },
		{ value: 'desc', label: 'Descending' }
	];

	const orderByOptions = [
		{ value: 'relevance', label: 'Relevance' },
		{ value: 'createdAt', label: 'Time of Post' },
		{ value: 'title', label: 'Title' }
	];

	function submit() {
		formRef?.requestSubmit();
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		const params = page.url.searchParams;

		params.set('search', search);
		params.set('tags', tags.join(';'));
		params.set('careerStage', careerStage.join(';'));
		if (durationStart && durationEnd) {
			params.set('start', durationStart);
			params.set('end', durationEnd);
		} else {
			params.delete('start');
			params.delete('end');
		}
		params.set('orderBy', orderBy);
		params.set('order', order);

		params.delete('page'); // Reset page on new search

		// Remove empty search params
		for (const key of Array.from(params.keys())) {
			if (!params.get(key)) params.delete(key);
		}

		goto(`?${params.toString()}`, { invalidateAll: true, keepFocus: true });
	}
</script>

<form
	bind:this={formRef}
	method="GET"
	class="flex w-full flex-col items-center justify-center gap-2"
	aria-label="Search Form"
	{onsubmit}
>
	<div
		class="border-input bg-background selection:bg-primary selection:text-primary-foreground flex h-10 w-full max-w-2xl min-w-0 rounded-md border text-base shadow-xs outline-none md:text-sm"
	>
		<Search class="text-muted-foreground h-10 w-10 p-3" />
		<Input
			bind:value={search}
			id="search"
			placeholder="Search"
			class="h-full rounded-l-none border-none shadow-none"
			aria-label="Search"
			max="250"
		/>
	</div>

	<div class="mt-2 flex flex-wrap items-center justify-center gap-4">
		<div class="flex items-center gap-2">
			<Label for="tags">Tags:</Label>
			<TagMultiselectCombobox
				bind:tags
				{globalTags}
				{userTags}
				onChange={submit}
				allowCustom
				placeholder="Search Tags"
				emptyText="No existing tags found"
				buttonProps={{ id: 'tags', class: 'w-[200px]' }}
			/>
		</div>

		<div class="flex items-center gap-2">
			<Label for="career-stage">Career Stage:</Label>
			<MultiselectCombobox
				bind:items={careerStage}
				defaultOptions={fullCareerStageList}
				onChange={submit}
				allowCustom
				buttonProps={{ id: 'career-stage', class: 'w-[200px]' }}
			/>
		</div>

		<div class="flex items-center gap-2">
			<Label for="sort-by">Sort By:</Label>
			<Select.Root bind:value={orderBy} onValueChange={submit} type="single">
				<Select.Trigger id="sort-by">
					{orderByOptions.find((f) => f.value === orderBy)?.label ?? 'Select an option'}
				</Select.Trigger>
				<Select.Content>
					{#each orderByOptions as option}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
			<Select.Root bind:value={order} onValueChange={submit} type="single">
				<Select.Trigger>
					{orderOptions.find((f) => f.value === order)?.label ?? 'Select an option'}
				</Select.Trigger>
				<Select.Content>
					{#each orderOptions as option}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex items-center gap-2">
			<Label for="date-range">Date Range:</Label>
			<Popover.Root bind:open={dateRangeOpen} onOpenChange={submit}>
				<Popover.Trigger id="date-range">
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-[200px] justify-between font-normal">
							{durationStart && durationEnd
								? `${dayjs(durationStart, 'YYYY-MM-DD').format('l')} - ${dayjs(durationEnd, 'YYYY-MM-DD').format('l')}`
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
		</div>
	</div>
</form>
