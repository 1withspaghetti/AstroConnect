import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    return redirect(301, `/dashboard/post/${params.postId}/edit/description`);
}) satisfies PageServerLoad;