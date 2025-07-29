import { z } from 'zod/v4';

export const settingsEditSchema = z.object({
	darkMode: z.boolean(),
	receivingEmail: z.email()
});
