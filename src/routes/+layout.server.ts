import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, url }) => {
	// if (url.pathname === '/') {
	// 	// throw redirect(308, `/home`);
	// }

	// throw redirect(303, `/home?redirectTo=${url.pathname}`);

	return {};
}) satisfies LayoutServerLoad;
