import type { PageServerLoad, Actions } from './$types';
// import { getUsername } from '$lib/server/db/connectdb';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ coockie, url }) => {
	// throw redirect(303, `/home?redirectTo=${url.pathname}`);
	// throw redirect(303, `/login?redirectTo=${url.pathname}`);

	return {};
}) satisfies PageServerLoad;

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('username');
		console.log('testche');

		getUsername(name);
	}
} satisfies Actions;
