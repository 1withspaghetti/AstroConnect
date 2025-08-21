<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { SessionUser } from '@/types/user';
	import apiRequest from '@/util/apiClient';
	import { cn } from '@/utils';
	import { toast } from 'svelte-sonner';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		isImpersonating,
		user,
		...restProps
	}: { isImpersonating: boolean; user: SessionUser } & HTMLAttributes<HTMLDivElement> = $props();

	function returnToAdmin() {
		apiRequest('GET', '/login/admin/user')
			.then(() => {
				toast.success(`Switched back to your own account`);
				invalidateAll();
			})
			.catch((err) => {
				toast.error('Failed to switch user: ' + err.message);
			});
	}
</script>

{#if isImpersonating}
	<div
		{...restProps}
		class={cn(
			'sticky top-0 z-30 w-full border-b border-amber-300 bg-amber-200 py-0.5 text-center text-sm',
			restProps.class
		)}
	>
		You are signed in as {user.name} ({user.email}).
		<button
			onclick={returnToAdmin}
			class="cursor-pointer text-blue-600 hover:underline dark:text-blue-500"
			>Return to Admin Account</button
		>
	</div>
{/if}
