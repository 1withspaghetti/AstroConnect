<script lang="ts">
	import { page } from '$app/state';
	import { Input } from '@/components/ui/input';
	import Search from '@lucide/svelte/icons/search';
	import { Label } from '@/components/ui/label';
	import * as Select from '@/components/ui/select';
	import MultiselectCombobox from '@/components/ui/MultiselectCombobox.svelte';
	import { defaultCareerStageLevels } from '@/types/post';
	import { goto } from '$app/navigation';
	import TagMultiselectCombobox from '@/components/ui/TagMultiselectCombobox.svelte';

	let { globalTags, userTags }: { globalTags: string[]; userTags: string[] } = $props();

	let formRef = $state<HTMLFormElement>(null!);

	let search = $state(page.url.searchParams.get('search') || '');
	let tags = $state(page.url.searchParams.get('tags')?.split(';') || []);
	let careerStage = $state(page.url.searchParams.get('careerStage')?.split(';') || []);

	let orderBy = $state(page.url.searchParams.get('orderBy') || 'relevance');
	let order = $state(page.url.searchParams.get('order') || 'desc');

	let fullCareerStageList = $derived(
		careerStage.concat(defaultCareerStageLevels.filter((custom) => !careerStage.includes(custom)))
	);

	const orderOptions = [
		{ value: 'asc', label: 'Ascending' },
		{ value: 'desc', label: 'Descending' }
	];

	const orderByOptions = [
		{ value: 'relevance', label: 'Relevance' },
		{ value: 'name', label: 'Name' }
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
		params.set('orderBy', orderBy);
		params.set('order', order);

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
			id="query"
			name="query"
			placeholder="Search"
			class="h-full rounded-l-none border-none shadow-none"
			aria-label="Search"
			max="250"
		/>
	</div>

	<div class="mt-2 flex flex-wrap items-center justify-center gap-4">
		<div class="flex items-center gap-2">
			<Label>Career Stage:</Label>
			<MultiselectCombobox
				bind:items={careerStage}
				defaultOptions={fullCareerStageList}
				onChange={submit}
				allowCustom
				buttonProps={{ class: 'w-[200px]' }}
			/>
		</div>

		<div class="flex items-center gap-2">
			<Label>Tags:</Label>
			<TagMultiselectCombobox
				bind:tags
				{globalTags}
				{userTags}
				onChange={submit}
				allowCustom
				placeholder="Search Tags"
				emptyText="No existing tags found"
				buttonProps={{ class: 'w-[200px]' }}
			/>
		</div>

		<div class="flex items-center gap-2">
			<Label>Sort By:</Label>
			<Select.Root bind:value={orderBy} onValueChange={submit} type="single">
				<Select.Trigger>
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
	</div>
</form>
