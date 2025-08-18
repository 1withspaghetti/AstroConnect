<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Avatar from '@/components/ui/avatar';
	import type { UserPreview } from '@/types/user';
	import apiRequest from '@/util/apiClient';
	import ImagePlus from '@lucide/svelte/icons/image-plus';
	import { toast } from 'svelte-sonner';
	import { Avatar as AvatarPrimitive } from 'bits-ui';

	let { user, ...restProps }: { user: UserPreview } & AvatarPrimitive.RootProps = $props();

	let isLoading = $state<boolean>(false);

	let pfp = $state<string | null>(user.pfp);
	$effect(() => {
		pfp = user.pfp;
	});

	function onFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isLoading = true;

		const formData = new FormData();
		formData.append('image', file);

		apiRequest('POST', `/dashboard/profile/image`, formData)
			.then((data) => {
				toast.success('Profile picture updated');
				pfp = data.pfp; // Update user profile picture
				invalidateAll();
			})
			.catch((error) => {
				console.error('Failed to upload profile picture:', error.message);
				toast.error('Failed to upload profile picture: ' + error.message);
			})
			.finally(() => {
				isLoading = false;
				target.value = ''; // Clear input after upload
			});
	}
</script>

<Avatar.Root {...restProps}>
	<Avatar.Image src={pfp} alt={user.name} />
	<Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
	<label
		class="absolute bottom-0 w-full bg-black/50 text-center text-xs text-white focus-within:bg-black/70 hover:bg-black/70"
	>
		<ImagePlus class="my-1 inline size-4" />
		<input
			type="file"
			class="sr-only"
			accept="image/png,image/jpeg,image/avif,image/webp,image/tiff"
			multiple={false}
			onchange={onFileUpload}
		/>
	</label>
</Avatar.Root>
