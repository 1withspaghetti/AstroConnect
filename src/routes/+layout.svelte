<script lang="ts">
	import { Toaster } from '@/components/ui/sonner';
	import '../app.css';

	let { children } = $props();
</script>

<Toaster />

{@render children()}
