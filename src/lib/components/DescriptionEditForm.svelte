<script lang="ts">
	import { descriptionEditFormSchema } from '@/validators/descriptionEditFormValidator';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Textarea from './ui/textarea/textarea.svelte';
	import SelectCombobox from './ui/SelectCombobox.svelte';
	import { defaultCareerStageLevels } from '@/types/post';
	import MultiselectCombobox from './ui/MultiselectCombobox.svelte';
	import { uniqueTags } from '@/fake_data';
	import Button from './ui/button/button.svelte';
	import { toast } from 'svelte-sonner';

	let {
		formInputData
	}: {
		formInputData: SuperValidated<Infer<typeof descriptionEditFormSchema>>;
	} = $props();

	let form = superForm(formInputData, {
		validators: zod4Client(descriptionEditFormSchema),
		dataType: 'json',
		taintedMessage: true,
		resetForm: false,
		onUpdated: ({ form }) =>
			form.message && toast[form.message.type](form.message.text, { duration: 3000 })
	});

	const { form: formData, enhance, submitting, tainted } = form;

	// Ensure careerStage is always an array for consistency
	let fullCareerStageList = $derived(
		$formData.careerStage
			? defaultCareerStageLevels.includes($formData.careerStage)
				? defaultCareerStageLevels
				: [...defaultCareerStageLevels, $formData.careerStage]
			: defaultCareerStageLevels
	);

	let fullTagList = $derived(
		[...new Set([...uniqueTags, ...$formData.tags])].sort((a, b) => a.localeCompare(b))
	);
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Title</Form.Label>
				<Input {...props} bind:value={$formData.title} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="desc">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Textarea {...props} bind:value={$formData.desc} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="careerStage">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Career Stage (optional)</Form.Label>
				<SelectCombobox bind:item={$formData.careerStage} defaultOptions={fullCareerStageList} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="prereq">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Prerequisites (optional)</Form.Label>
				<Input {...props} bind:value={$formData.prereq} />
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
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="mt-4 flex justify-center gap-4">
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
