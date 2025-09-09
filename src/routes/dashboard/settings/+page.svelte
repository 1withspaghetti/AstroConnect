<script lang="ts">
	import type { PageProps } from './$types';
	import Meta from '@/components/Meta.svelte';
	import UserSettings from './UserSettings.svelte';
	import AppearanceSettings from './AppearanceSettings.svelte';
	import ProxySettings from './ProxySettings.svelte';

	let { data }: PageProps = $props();
</script>

<Meta title="Settings" />

<div class="flex flex-wrap items-start justify-center gap-8 p-4 pt-16 pb-16">
	<UserSettings userSettingsFormInputData={data.userSettingsForm} user={data.user} />
	<AppearanceSettings />
	<ProxySettings proxyUserFormInputData={data.proxyUserForm} proxyUsers={data.proxyUsers} />
</div>
