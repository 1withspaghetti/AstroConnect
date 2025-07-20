<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Input } from '@/components/ui/input';
	import Search from '@lucide/svelte/icons/search';
	import { uniqueTags } from './fake_data';
	import { Label } from '@/components/ui/label';
	import * as Select from '@/components/ui/select';
	import MultiselectCombobox from '@/components/ui/MultiselectCombobox.svelte';
	import { defaultExperienceLevels } from '@/types/post';

	let search = $state(page.url.searchParams.get('query') || '');
	let tags = $state(page.url.searchParams.get('tags')?.split(';') || []);
	let experience = $state(page.url.searchParams.get('experience')?.split(';') || []);

	let order = $state(page.url.searchParams.get('order') || 'asc');
	let orderBy = $state(page.url.searchParams.get('orderBy') || 'createdAt');

	let fullTagList = $derived(
		[...new Set([...uniqueTags, ...tags])].sort((a, b) => a.localeCompare(b))
	);

	let fullExperienceList = $derived(
		defaultExperienceLevels.concat(
			experience.filter((custom) => !defaultExperienceLevels.includes(custom))
		)
	);

	const orderOptions = [
		{ value: 'asc', label: 'Ascending' },
		{ value: 'desc', label: 'Descending' }
	];

	const orderByOptions = [
		{ value: 'createdAt', label: 'Time of Post' },
		{ value: 'title', label: 'Title' }
	];
</script>

<form
	method="POST"
	use:enhance
	class="flex w-full flex-col items-center justify-center gap-2"
	aria-label="Search Form"
>
	<div
		class="border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground flex h-10 w-full max-w-2xl min-w-0 rounded-md border text-base shadow-xs outline-none md:text-sm"
	>
		<Search class="text-muted-foreground h-10 w-10 p-3" />
		<Input
			bind:value={search}
			id="query"
			name="query"
			placeholder="Search"
			class="h-full rounded-l-none border-none shadow-none"
			aria-label="Search"
		/>
	</div>

	<div class="mt-2 flex flex-wrap items-center justify-center gap-4">
		<div class="flex items-center gap-2">
			<Label>Tags:</Label>
			<MultiselectCombobox
				bind:items={tags}
				defaultOptions={fullTagList}
				allowCustom
				placeholder="Search Tags"
				emptyText="No existing tags found"
			/>
		</div>

		<div class="flex items-center gap-2">
			<Label>Experience:</Label>
			<MultiselectCombobox
				bind:items={experience}
				defaultOptions={fullExperienceList}
				allowCustom
				placeholder="Level"
			/>
		</div>

		<div class="flex items-center gap-2">
			<Label>Sort By:</Label>
			<Select.Root bind:value={orderBy} type="single">
				<Select.Trigger>
					{orderByOptions.find((f) => f.value === orderBy)?.label ?? 'Select an option'}
				</Select.Trigger>
				<Select.Content>
					{#each orderByOptions as option}
						<Select.Item value={option.value} label={option.label} />
					{/each}
				</Select.Content>
			</Select.Root>
			<Select.Root bind:value={order} type="single">
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

	<Label class="mt-2 italic">6 results</Label>
</form>
