import { error, fail } from '@sveltejs/kit';
import db from '$lib/server/db/connectdb';
import { spanWrap } from '$lib/gadgetBag';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const categories = await db.categories.getdAll();

	return { categories };
}) satisfies PageServerLoad;

export const actions = {
	async add({ request }) {
		const formData = await request.formData();
		const name = formData.get('name');

		const added = await db.categories.add(name).catch((error) => error);

		if (added.error) {
			return fail(409, { message: added.message });
		}

		return { success: true, message: '' };
	},
	async edit({ request }) {
		const formData = await request.formData();
		const categoryName = formData.get('name');
		const newCategoryName = formData.get('newName');

		if (categoryName === newCategoryName) {
			return fail(409, { success: false, message: 'Same name' });
		}

		const updated = await db.categories
			.update(categoryName, newCategoryName)
			.catch((error) => error);

		if (!updated) {
			console.log('Something went wrong when trying to delete the category name');
			console.log({ updated });
			return fail(500, { success: false, message: 'Something went wrong.' });
		}

		return {
			success: true,
			message: `Successfully changed from ${spanWrap(categoryName)} to ${spanWrap(newCategoryName)}`
		};
	},
	async delete({ request }) {
		//
	}
} satisfies Actions;
