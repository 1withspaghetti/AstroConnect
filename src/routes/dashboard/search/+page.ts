import type { PageLoad } from './$types';
import researchOpportunities from './fake_data';

export const load = (async ({ data }) => {
	return {
		...data,
		researchOpportunities
	};
}) satisfies PageLoad;
