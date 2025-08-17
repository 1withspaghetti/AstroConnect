<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { buttonVariants } from './ui/button';
	import Upload from '@lucide/svelte/icons/upload';
	import File from '@lucide/svelte/icons/file';
	import { toast } from 'svelte-sonner';
	import Progress from './ui/progress/progress.svelte';
	import apiRequest from '@/util/apiClient';

	type Props = HTMLInputAttributes & {
		value?: string;
	};

	let { value = $bindable<string>(), ...restProps }: Props = $props();

	let fileName = $state<string | undefined>(undefined);
	let fileProgress = $state<number>(0);

	$effect(() => {
		if (!value) {
			fileName = undefined;
			fileProgress = 0;
		}
	});

	async function onFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		fileName = file.name;
		fileProgress = 0;

		// Get S3 upload URL

		const res = await apiRequest('POST', '/home/post/upload', {
			name: file.name,
			size: file.size
		}).catch((error) => {
			toast.error(`Upload failed: ${error.message}`);
			throw error;
		});

		const { uploadUrl, id }: { uploadUrl: string; id: string } = await res.json();

		// Send to S3

		let req = new XMLHttpRequest();
		req.upload.onprogress = (event) => {
			fileProgress = event.loaded / event.total;
		};
		req.upload.onerror = (event) => {
			console.error('Upload error', event);
			toast.error('Failed to upload ' + file.name);
		};
		req.upload.onloadend = (event) => {
			fileProgress = event.loaded / event.total;
			value = id;
		};
		req.onreadystatechange = () => {
			if (req.readyState === 4) {
				if (req.status !== 200) {
					toast.error('Failed to upload ' + file.name);
				}
			}
		};
		req.open('PUT', uploadUrl, true);
		req.send(file);
	}
</script>

<label
	for={restProps.id}
	aria-disabled={restProps.disabled}
	aria-invalid={restProps['aria-invalid']}
	class={buttonVariants({
		size: 'sm',
		variant: 'ghost',
		class:
			'bg-accent text-accent-foreground hover:bg-accent/80 focus-within:border-ring focus-within:ring-ring/50 flex h-16 w-full flex-col focus-within:ring-[3px]'
	})}
>
	{#if fileName === undefined}
		<div class="flex items-center gap-2">
			<Upload />
			<span><b>Click to Upload</b> or drag and drop</span>
		</div>
	{:else}
		<div class="flex items-center gap-2">
			<File />
			<span>{fileName}</span>
		</div>
		{#if fileProgress < 1}
			<div class="w-32">
				<Progress value={fileProgress} max={1} />
			</div>
		{/if}
	{/if}
	<input
		type="file"
		form=""
		class="sr-only"
		{...restProps}
		multiple={false}
		onchange={onFileUpload}
	/>
	<input type="hidden" name={restProps.name} {value} />
</label>
