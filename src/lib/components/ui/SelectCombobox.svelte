<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Button, type ButtonProps } from '@/components/ui/button';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { cn } from '@/utils';
	import { tick } from 'svelte';

	type T = string;

	type Props = {
		item?: T;
		defaultOptions: T[];
		onChange?: (item: T) => void;
		allowCustom?: boolean;
		placeholder?: string;
		emptyText?: string;
		buttonProps?: ButtonProps;
	};

	let {
		item = $bindable(),
		defaultOptions = [],
		onChange,
		allowCustom = false,
		placeholder = 'Select...',
		emptyText,
		buttonProps
	}: Props = $props();

	let open = $state(false);
	let openTriggerRef = $state<HTMLButtonElement>(null!);
	let search = $state('');

	let displayText = $derived(item ? item : placeholder);

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
				{...props}
				role="combobox"
				aria-expanded={open}
				{...buttonProps}
				class={cn('w-full justify-between', buttonProps?.class)}
			>
				<span class="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{displayText}</span>
				<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input bind:value={search} {placeholder} />
			<Command.List>
				{#if emptyText}
					<Command.Empty>{emptyText}</Command.Empty>
				{/if}
				<Command.Group>
					{#each defaultOptions as option}
						<Command.Item
							value={option}
							onSelect={() => {
								item = option;
								closeAndFocusTrigger();
								onChange?.(item);
							}}
						>
							<CheckIcon class={cn('mr-2 size-4', item !== option && 'text-transparent')} />
							{option}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if allowCustom}
					<Command.Group forceMount>
						{#if search && !defaultOptions.includes(search)}
							<Command.Item
								value={search}
								onSelect={() => {
									item = search;
									closeAndFocusTrigger();
									onChange?.(item);
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
