<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { profileEditSchema } from '@/validators/profileEditSchema';
	import { Input } from '@/components/ui/input';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Button } from '@/components/ui/button';
	import UserAvatar from '@/components/UserAvatar.svelte';
	import fakeData from '@/fake_data';
	import { Label } from '@/components/ui/label';
	import dayjs from 'dayjs';

	let { data }: PageProps = $props();

	let form = superForm(data.form, {
		validators: zod4Client(profileEditSchema),
		taintedMessage: true
	});

	let { form: formData, enhance, submitting, tainted } = form;

	const user = fakeData[0].createdBy;
</script>

<div class="flex flex-col items-center p-4 pb-16">
	<Card.Root class="mt-32 w-full max-w-lg">
		<Card.Header class="pt-8">
			<div class="flex justify-center">
				<UserAvatar {user} class="absolute size-24 -translate-y-full" />
			</div>
			<Card.Title>Edit Profile</Card.Title>
			<Card.Description>
				This will be included in every application you send, and on every research opportunity you
				post.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="flex flex-col gap-6">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Display Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
							<Form.Description>
								Please enter your full name or a name you would like to be known by.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="bio">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Bio</Form.Label>
							<Textarea {...props} bind:value={$formData.bio} />
							<Form.Description>
								A short description about yourself, your current research interests, or your
								background.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="space-y-2">
					<Label>Email</Label>
					<Input disabled bind:value={data.user.email} />
					<div class="text-muted-foreground text-sm">
						This cannot be changed here because it is connected to the account you used to sign up.
					</div>
				</div>
			</form>
		</Card.Content>
		<Card.Footer>
			<Button type="submit" disabled={$submitting || !$tainted}>Save</Button>
			<Button
				type="reset"
				variant="secondary"
				disabled={!$tainted}
				onclick={(e) => {
					e.preventDefault();
					form.reset();
				}}
			>
				Reset
			</Button>
		</Card.Footer>
		<Card.Footer class="text-muted-foreground text-sm">
			<p>
				Signed Up: <span title={dayjs(data.user.createdAt).format('LLLL')}
					>{dayjs(data.user.createdAt).format('MMMM D, YYYY')}</span
				><br />
				User ID: <span>{data.user.id}</span>
			</p>
		</Card.Footer>
	</Card.Root>
</div>
