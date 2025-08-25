<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { profileEditSchema } from '@/validators/profileEditValidator';
	import { Input } from '@/components/ui/input';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Button } from '@/components/ui/button';
	import dayjs from 'dayjs';
	import { toast } from 'svelte-sonner';
	import { Switch } from '@/components/ui/switch';
	import ProfilePfpUpload from './ProfilePfpUpload.svelte';
	import SelectCombobox from '@/components/ui/SelectCombobox.svelte';
	import { defaultCareerStageLevels, defaultTags } from '@/types/post';
	import MultiselectCombobox from '@/components/ui/MultiselectCombobox.svelte';
	import Meta from '@/components/Meta.svelte';

	let { data }: PageProps = $props();

	let form = superForm(data.form, {
		validators: zod4Client(profileEditSchema),
		dataType: 'json',
		taintedMessage: true,
		resetForm: false,
		onUpdated: ({ form }) =>
			form.message && toast[form.message.type](form.message.text, { duration: 3000 }),
		onError: ({ result }) =>
			toast.error(
				'Error submitting: ' + (result.error.message || 'Unknown error ' + result.status),
				{ duration: 3000 }
			)
	});

	let { form: formData, enhance, submitting, tainted } = form;

	const user = data.user;

	// Ensure careerStage is always an array for consistency
	let fullCareerStageList = $derived(
		$formData.careerStage
			? defaultCareerStageLevels.includes($formData.careerStage)
				? defaultCareerStageLevels
				: [...defaultCareerStageLevels, $formData.careerStage]
			: defaultCareerStageLevels
	);

	let tagList = $derived(
		defaultTags.concat(data.userTagList.filter((tag) => !defaultTags.includes(tag)))
	);

	let fullTagList = $derived(
		$formData.tags.concat(tagList.filter((tag) => !$formData.tags.includes(tag)))
	);
</script>

<Meta title="Profile" />

<div class="flex flex-col items-center p-4 pb-16">
	<Card.Root class="mt-16 w-full max-w-lg">
		<Card.Header class="pt-8">
			<div class="flex justify-center">
				<ProfilePfpUpload {user} class="absolute size-24 -translate-y-full" />
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
							<Form.Label>Bio (optional)</Form.Label>
							<Textarea {...props} bind:value={$formData.bio} />
							<Form.Description>
								A short description about yourself, your current research interests, or your
								background.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="careerStage">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Career Stage (optional)</Form.Label>
							<SelectCombobox
								bind:item={$formData.careerStage}
								defaultOptions={fullCareerStageList}
							/>
							<Form.Description>
								Where are you in your academic or professional journey?
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="major">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Major (optional)</Form.Label>
							<Input {...props} bind:value={$formData.major} />
							<Form.Description>
								If you are a student, what is your major or field of study?
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="tags">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Tags (optional)</Form.Label>
							<MultiselectCombobox
								bind:items={$formData.tags}
								defaultOptions={fullTagList}
								allowCustom={true}
								placeholder="Search Tags"
								emptyText="No existing tags found"
							/>
							<Form.Description>
								Topics related to your research interests, skills, or areas of expertise.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="isPublic">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex w-full flex-row items-center justify-between gap-4">
								<div class="space-y-0.5">
									<Form.Label>Researcher Visibility</Form.Label>
									<Form.Description>
										Should your profile (including email) be listed publicly as a researcher? This
										will allow others to find and contact you for research opportunities.
									</Form.Description>
								</div>
								<Switch {...props} bind:checked={$formData.isPublic} />
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex gap-2">
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
				</div>
			</form>
		</Card.Content>
		<Card.Footer class="text-muted-foreground flex-wrap justify-between gap-x-2 text-sm">
			<span>
				<u>Signed Up:</u>
				<span title={dayjs(user.firstLogin).format('LLLL')}
					>{dayjs(user.firstLogin).format('MMMM D, YYYY')}</span
				>
			</span>
			<span>
				<u>Last Login:</u>
				<span title={dayjs(user.lastLogin).format('LLLL')}
					>{dayjs(user.lastLogin).format('MMMM D, YYYY')}</span
				>
			</span>
			<span>
				<u>User ID:</u> <span>{user.id}</span>
			</span>
		</Card.Footer>
	</Card.Root>
</div>
