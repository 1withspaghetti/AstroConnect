<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import Search from '@lucide/svelte/icons/search';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CheckIcon from '@lucide/svelte/icons/check';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { cn } from '@/utils';
	import { tick } from 'svelte';
	import { uniqueTags } from './fake_data';
	import { Label } from '@/components/ui/label';
	import * as Select from '@/components/ui/select';

	let search = $state(page.url.searchParams.get('query') || '');
	let tags = $state(page.url.searchParams.get('tags')?.split(';') || []);

	let order = $state(page.url.searchParams.get('order') || 'asc');
	let orderBy = $state(page.url.searchParams.get('orderBy') || 'createdAt');

	let tagsOpen = $state(false);
	let tagSearch = $state('');
	let tagTriggerRef = $state<HTMLButtonElement>(null!);

	let fullTagList = $derived(
		[...new Set([...uniqueTags, ...tags])].sort((a, b) => a.localeCompare(b))
	);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		tagsOpen = false;
		tick().then(() => {
			tagTriggerRef.focus();
		});
	}

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
	class="w-full flex-col items-start justify-center gap-2"
	aria-label="Search Form"
>
	<div
		class="border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground flex h-10 w-full min-w-0 rounded-md border text-base shadow-xs outline-none md:text-sm"
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

	<div class="mt-2 flex items-center justify-center gap-2">
		<Label>Tags:</Label>
		<Popover.Root bind:open={tagsOpen}>
			<Popover.Trigger bind:ref={tagTriggerRef}>
				{#snippet child({ props })}
					<Button
						variant="outline"
						class="w-[200px]s justify-between"
						{...props}
						role="combobox"
						aria-expanded={tagsOpen}
					>
						<span class="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
							>{tags.length > 0 ? tags.join(', ') : 'Search Tags'}</span
						>
						<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input bind:value={tagSearch} placeholder="Search tags..." />
					<Command.List>
						<Command.Empty>No Existing Tags Found</Command.Empty>
						<Command.Group>
							{#each fullTagList as tag}
								<Command.Item
									value={tag}
									onSelect={() => {
										tags = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
										closeAndFocusTrigger();
									}}
								>
									<CheckIcon class={cn('mr-2 size-4', !tags.includes(tag) && 'text-transparent')} />
									{tag}
								</Command.Item>
							{/each}
						</Command.Group>
						<Command.Group forceMount>
							{#if tagSearch && !fullTagList.includes(tagSearch)}
								<Command.Item
									value={tagSearch}
									onSelect={() => {
										tags = [...tags, tagSearch];
										closeAndFocusTrigger();
									}}
									forceMount
								>
									<CheckIcon class="mr-2 size-4 text-transparent" />
									Add "{tagSearch}"
								</Command.Item>
							{/if}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>

		<Label class="ml-4">Sort By:</Label>
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
</form>
