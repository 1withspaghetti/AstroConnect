<script lang="ts">
	import Meta from '@/components/Meta.svelte';
	import type { PageProps } from './$types';
	import { Separator } from '@/components/ui/separator';

	let { data }: PageProps = $props();
</script>

<Meta title="Info & Contact" />

<div class="mx-auto max-w-4xl px-4 pb-16">
	<div class="flex items-end justify-between">
		<h1 class="mt-8 text-2xl font-bold">Info & Contact</h1>
	</div>
	<Separator class="mt-1 mb-4" />
	<p>
		AstroConnect is an <a
			href="https://github.com/1withspaghetti/AstroConnect"
			target="_blank"
			rel="noopener"
			class="text-blue-600 hover:underline">open-source project</a
		> created by Tyler Place at Cal Poly SLO. It was created as Summer Project at UW Astro, supervised/mentored
		by Ishan Ghosh-Coutinho. A then Post-Baccalaureate with the department, Ishan reached out to Tyler
		after desiring to bridge the lack of connection between students looking for research opportunities
		and faculty/researchers who might provide those opportunities. With help from Ishan constantly communicating,
		providing feedback, and getting input from potential users, Tyler designed and developed this platform,
		and hopes it will be a useful resource for the Astronomy community at UW. The project is now managed
		by Matt McQuinn at the faculty level and Post-Baccalaureate Ruby Hiedgerken, who is serving as the
		student liaison, with Tyler and Ishan only providing support remotely.
	</p>
	<ul class="mt-4 list-inside list-disc space-y-2">
		<li>
			Tyler Place:
			<a class="text-blue-600 hover:underline" href="mailto:tylerlplace@gmail.com"
				>tylerlplace@gmail.com</a
			>.
		</li>
		<li>
			Ishan Ghosh-Coutinho:
			<a class="text-blue-600 hover:underline" href="mailto:ishan@ifgc-astro.space"
				>ishan@ifgc-astro.space</a
			>.
		</li>
		<li>
			Matt McQuinn:
			<a class="text-blue-600 hover:underline" href="mailto:mcquinn@uw.edu">mcquinn@uw.edu</a>.
		</li>
		<li>
			Ruby Hiedgerken:
			<a class="text-blue-600 hover:underline" href="mailto:rheid@uw.edu">rheid@uw.edu</a>.
		</li>
	</ul>
	<p class="mt-8 text-sm opacity-70">
		For bug reports, please contact Tyler, the developer, at <a
			class="text-blue-600 hover:underline"
			href="mailto:tylerlplace@gmail.com">tylerlplace@gmail.com</a
		>.
	</p>
</div>
