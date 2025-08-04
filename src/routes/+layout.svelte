<script lang="ts">
	import { Toaster } from '@/components/ui/sonner';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />

{@render children()}
