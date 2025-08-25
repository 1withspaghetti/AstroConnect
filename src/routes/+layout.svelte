<script lang="ts">
	import { Toaster } from '@/components/ui/sonner';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Meta from '@/components/Meta.svelte';

	let { children } = $props();
</script>

<Meta
	title="AstroConnect"
	noTitleSuffix
	description="Connecting UW students to Astronomy Research Opportunities"
/>

<ModeWatcher />
<Toaster />

{@render children()}
