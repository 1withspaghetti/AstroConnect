import z from 'zod/v4';
import { tagValidator } from './descriptionEditFormValidator';

export const defaultTagSchema = z.object({
	tag: tagValidator
});
