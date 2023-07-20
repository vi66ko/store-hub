import db from '$lib/server/db/connectdb';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const brands = await db.brands.getAll();

	return { brands };
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const brandName = formData.get('name');

		const result = await db.brands.add(brandName).catch((error) => error);

		if (!result.isSuccessful) {
			return fail(409, { existMessage: result.message });
		}

		return { success: true };
	}
} satisfies Actions;
