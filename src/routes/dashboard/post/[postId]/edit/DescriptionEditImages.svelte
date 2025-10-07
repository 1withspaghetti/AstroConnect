<script lang="ts">
	import type { PostImage } from '@/types/post';
	import * as Carousel from '@/components/ui/carousel';
	import { Button, buttonVariants } from '@/components/ui/button';
	import ImagePlus from '@lucide/svelte/icons/image-plus';
	import { Progress } from '@/components/ui/progress';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Trash from '@lucide/svelte/icons/trash';
	import apiRequest from '@/util/apiClient';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { CarouselAPI } from '@/components/ui/carousel/context';

	let { postId, images: unorderedImages }: { postId: string; images: PostImage[] } = $props();

	let images = $derived(unorderedImages.sort((a, b) => a.order - b.order));

	let fileName = $state<string | undefined>(undefined);
	let fileProgress = $state<number>(0);

	let isLoading = $state<boolean>(false);

	let carouselAPI = $state<CarouselAPI>();

	async function onFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		fileName = file.name;
		fileProgress = 0;
		isLoading = true;

		const formData = new FormData();
		formData.append('image', file);

		let req = new XMLHttpRequest();
		req.upload.onprogress = (event) => {
			fileProgress = event.loaded / event.total;
		};
		req.upload.onerror = (event) => {
			console.error('Upload error', event);
			toast.error('Error during upload');
		};
		req.upload.onloadend = (event) => {
			fileProgress = event.loaded / event.total;
			target.files = null; // Clear input after upload
			invalidateAll().finally(() => {
				fileName = undefined;
				fileProgress = 0;
				isLoading = false;
				carouselAPI?.reInit();
			});
		};
		req.onreadystatechange = () => {
			if (req.readyState === 4) {
				if (req.status !== 200) {
					toast.error('Failed to upload: ' + req.status + ': ' + req.statusText);
				}
			}
		};
		req.open('POST', `/dashboard/post/${postId}/edit/image`, true);
		req.send(formData);
	}

	function moveLeft(id: string) {
		const index = images.findIndex((image) => image.id === id);
		if (index <= 0) return;
		isLoading = true;
		updateOrder([
			...images.slice(0, index - 1),
			images[index],
			images[index - 1],
			...images.slice(index + 1)
		])
			.catch((error) => {
				toast.error('Failed to move image: ' + error.message);
			})
			.finally(() => {
				carouselAPI?.reInit();
				isLoading = false;
			});
	}

	function moveRight(id: string) {
		const index = images.findIndex((image) => image.id === id);
		if (index === -1 || index === images.length - 1) return;
		isLoading = true;
		updateOrder([
			...images.slice(0, index),
			images[index + 1],
			images[index],
			...images.slice(index + 2)
		])
			.catch((error) => {
				toast.error('Failed to move image: ' + error.message);
			})
			.finally(() => {
				carouselAPI?.reInit();
				isLoading = false;
			});
	}

	function deleteImage(id: string) {
		isLoading = true;
		apiRequest('DELETE', `/dashboard/post/${postId}/edit/image/${id}`)
			.catch((error) => {
				toast.error('Failed to delete image: ' + error.message);
			})
			.then(invalidateAll)
			.finally(() => {
				carouselAPI?.reInit();
				isLoading = false;
			});
	}

	async function updateOrder(newOrder: PostImage[]) {
		let updates: Promise<void>[] = [];
		for (let i = 0; i < newOrder.length; i++) {
			if (images.find((image) => image.id === newOrder[i].id)!.order !== i) {
				updates.push(
					apiRequest('PATCH', `/dashboard/post/${postId}/edit/image/${newOrder[i].id}`, {
						order: i
					})
				);
			}
		}
		await Promise.allSettled(updates);
		await invalidateAll();
	}
</script>

<Carousel.Root
	opts={{
		align: 'end'
	}}
	setApi={(emblaApi) => (carouselAPI = emblaApi)}
>
	<Carousel.Content class="ml-0">
		{#each images as image, i (image.id)}
			<Carousel.Item class="basis-auto p-4 pl-0 first:pl-4">
				<img src={image.url} alt="" class="h-64 object-contain object-center" />
				<div class="flex w-full justify-center">
					<Button
						variant="ghost"
						size="icon"
						class="size-8"
						onclick={() => moveLeft(image.id)}
						disabled={i === 0 || isLoading}
					>
						<ChevronLeft />
						<span class="sr-only">Move Left</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="text-destructive hover:text-destructive size-8"
						onclick={() => deleteImage(image.id)}
						disabled={isLoading}
					>
						<Trash />
						<span class="sr-only">Delete Image</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="size-8"
						onclick={() => moveRight(image.id)}
						disabled={i === images.length - 1 || isLoading}
					>
						<ChevronRight />
						<span class="sr-only">Move Right</span>
					</Button>
				</div>
			</Carousel.Item>
		{/each}
		<Carousel.Item class="basis-auto p-4 pl-0 first:pl-4">
			<label
				for="desc-image-upload"
				class={buttonVariants({
					size: 'sm',
					variant: 'ghost',
					class:
						'bg-accent text-accent-foreground hover:bg-accent/80 focus-within:border-ring focus-within:ring-ring/50 flex h-64 w-64 flex-col items-center gap-2 focus-within:ring-[3px] has-disabled:opacity-50'
				})}
			>
				<ImagePlus class="size-8" />
				{#if fileName === undefined}
					<span><b>Click to Upload</b> or drag and drop</span>
				{:else}
					<span class="w-full truncate text-center">{fileName}</span>
				{/if}
				{#if fileProgress > 0}
					<div class="w-32">
						<Progress value={fileProgress} max={1} />
					</div>
				{/if}
				<input
					id="desc-image-upload"
					type="file"
					class="sr-only"
					accept="image/png,image/jpeg,image/avif,image/webp,image/tiff"
					multiple={false}
					onchange={onFileUpload}
					disabled={isLoading && !fileName}
				/>
			</label>
		</Carousel.Item>
	</Carousel.Content>
	<Carousel.Previous class="-left-2" />
	<Carousel.Next class="-right-2" />
</Carousel.Root>
