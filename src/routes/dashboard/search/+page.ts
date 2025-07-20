import type { PageLoad } from './$types';
import researchOpportunities from './fake_data';

export const load = (async () => {
	return {
		researchOpportunities
	};
}) satisfies PageLoad;
