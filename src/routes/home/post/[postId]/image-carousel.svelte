<script lang="ts">
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel';

	let { images }: { images: string[] } = $props();

	let mainApi = $state<CarouselAPI>();
	let previewApi = $state<CarouselAPI>();

	let current = $state(0);

	$effect(() => {
		if (mainApi) {
			current = mainApi.selectedScrollSnap();
			mainApi.on('select', () => {
				current = mainApi!.selectedScrollSnap();
			});
		}
	});
	$effect(() => {
		if (previewApi) {
			previewApi.on('select', () => {
				current = previewApi!.selectedScrollSnap();
			});
		}
	});

	$effect(() => {
		mainApi?.scrollTo(current);
		previewApi?.scrollTo(current);
	});
</script>

<Carousel.Root setApi={(emblaApi) => (mainApi = emblaApi)}>
	<Carousel.Content class="ml-0">
		{#each images as image}
			<Carousel.Item class="basis-auto p-4 pl-0 first:pl-4">
				<img src={image} alt="" class="h-64 object-contain object-center" />
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous class="-left-4" />
	<Carousel.Next class="-right-4" />
</Carousel.Root>
<Carousel.Root setApi={(emblaApi) => (previewApi = emblaApi)}>
	<Carousel.Content class="ml-0">
		{#each images as image, i}
			<Carousel.Item class="basis-auto py-1 pr-2 pl-0 first:pl-2">
				<button onclick={() => (current = i)} class="cursor-pointer">
					<img
						src={image}
						alt=""
						class="aspect-3/2 h-16 rounded-lg object-cover object-center {i === current
							? 'ring-ring ring-2'
							: ''}"
					/>
				</button>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
</Carousel.Root>
