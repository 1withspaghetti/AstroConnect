<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '@/components/ui/button';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from '@/utils';
	import { tick } from 'svelte';

	type T = string;

	type Props = {
		items: T[];
		defaultOptions: T[];
		allowCustom?: boolean;
		placeholder?: string;
		emptyText?: string;
	};

	let {
		items = $bindable(),
		defaultOptions = [],
		allowCustom = false,
		placeholder = 'Select...',
		emptyText
	}: Props = $props();

	let open = $state(false);
	let openTriggerRef = $state<HTMLButtonElement>(null!);
	let search = $state('');

	let displayText = $derived(items.length > 0 ? items.join(', ') : placeholder);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			openTriggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={openTriggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-[200px]s justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				<span class="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{displayText}</span>
				<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input bind:value={search} placeholder="Search tags..." />
			<Command.List>
				{#if emptyText}
					<Command.Empty>{emptyText}</Command.Empty>
				{/if}
				<Command.Group>
					{#each defaultOptions as item}
						<Command.Item
							value={item}
							onSelect={() => {
								items = items.includes(item) ? items.filter((t) => t !== item) : [...items, item];
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn('mr-2 size-4', !items.includes(item) && 'text-transparent')} />
							{item}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if allowCustom}
					<Command.Group forceMount>
						{#if search && !defaultOptions.includes(search)}
							<Command.Item
								value={search}
								onSelect={() => {
									items = [...items, search];
									closeAndFocusTrigger();
								}}
								forceMount
							>
								<CheckIcon class="mr-2 size-4 text-transparent" />
								"{search}"
							</Command.Item>
						{/if}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
