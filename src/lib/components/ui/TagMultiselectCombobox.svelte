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
		tags: T[];
		globalTags: T[];
		userTags: T[];
		onChange?: (tags: T[]) => void;
		allowCustom?: boolean;
		placeholder?: string;
		emptyText?: string;
		buttonProps?: ButtonProps;
	};

	let {
		tags = $bindable(),
		globalTags = [],
		userTags = [],
		onChange,
		allowCustom = false,
		placeholder = 'Select...',
		emptyText,
		buttonProps
	}: Props = $props();

	let open = $state(false);
	let openTriggerRef = $state<HTMLButtonElement>(null!);
	let search = $state('');

	let displayText = $derived(tags.length > 0 ? tags.join(', ') : placeholder);

	// We want to refocus the trigger button when the user selects
	// a tag from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			openTriggerRef.focus();
		});
	}

	let shownGlobalTags = $derived(globalTags.filter((tag) => !tags.includes(tag)));
	let shownUserTags = $derived(
		userTags.filter((tag) => !globalTags.includes(tag)).filter((tag) => !tags.includes(tag))
	);
</script>

{#snippet commandItem(tag: T)}
	<Command.Item
		value={tag}
		onSelect={() => {
			tags = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
			closeAndFocusTrigger();
			onChange?.(tags);
		}}
	>
		<CheckIcon class={cn('mr-2 size-4', !tags.includes(tag) && 'text-transparent')} />
		{tag}
	</Command.Item>
{/snippet}

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
				{#if tags.length > 0}
					<Command.Group heading="Selected Tags">
						{#each tags as tag (tag)}
							{@render commandItem(tag)}
						{/each}
					</Command.Group>
				{/if}
				<Command.Group heading="Global Tags">
					{#each shownGlobalTags as tag (tag)}
						{@render commandItem(tag)}
					{/each}
				</Command.Group>
				<Command.Group heading="User-created Tags">
					{#each shownUserTags as tag (tag)}
						{@render commandItem(tag)}
					{/each}
				</Command.Group>
				{#if allowCustom}
					<Command.Group forceMount>
						{#if search && !globalTags.includes(search) && !tags.includes(search)}
							<Command.Item
								value={search}
								onSelect={() => {
									tags = [...tags, search];
									closeAndFocusTrigger();
									onChange?.(tags);
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
