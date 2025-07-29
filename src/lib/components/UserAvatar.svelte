<script lang="ts">
	import type { User } from '@/types/user';
	import * as Avatar from './ui/avatar';
	import { Avatar as AvatarPrimitive } from 'bits-ui';

	let { user, ...restProps }: { user: User } & AvatarPrimitive.RootProps = $props();
</script>

<Avatar.Root {...restProps}>
	<Avatar.Image src={user.pfp} alt={user.name} />
	<Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
</Avatar.Root>
