import { error, fail } from '@sveltejs/kit';
import db from '$lib/server/db/connectdb';
import { spanWrap } from '$lib/gadgetBag';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const categories = await db.categories.getAll();

	return { categories };
}) satisfies PageServerLoad;

export const actions = {
	async add({ request }) {
		const formData = await request.formData();
		const categoryName = formData.get('categoryName');

		const doesExist = await db.categories.find(categoryName).catch((error) => error);
		if (doesExist) {
			return fail(409, { success: false, message: `${spanWrap(categoryName)} already exist.` });
		}

		const added = await db.categories.add(categoryName).catch((error) => error);
		if (!added) {
			return fail(409, {
				success: false,
				message: `Something went wrong when adding ${spanWrap(categoryName)}.`
			});
		}

		return {
			success: true,
			message: `Successfully add ${spanWrap(categoryName)}`
		};
	},
	async edit({ request }) {
		const formData = await request.formData();
		const categoryName = formData.get('categoryName');
		const newCategoryName = formData.get('newCategoryName');

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
		const formData = await request.formData();
		const categoryName = formData.get('categoryName');

		const deleted = await db.categories.delete(categoryName).catch((error) => error);

		if (!deleted) {
			console.log('Something went wrong when trying to delete the brand name');
			console.log({ deleted });
			return fail(500, { success: false, message: 'Something went wrong.' });
		}

		return { success: true, message: `Successfully deleted ${spanWrap(categoryName)}` };
	}
} satisfies Actions;
