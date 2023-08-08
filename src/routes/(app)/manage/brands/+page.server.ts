import { error, fail } from '@sveltejs/kit';
import db from '$lib/server/db/connectDb';
import { spanWrap } from '$lib/gadgetBag';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const brands = await db.brands.getAll();

	return { brands };
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const brandName = formData.get('name');
		console.log({ brandName });

		const doesExist = await db.brands.find(brandName).catch((error) => error);
		if (doesExist) {
			return fail(409, { success: false, message: `${spanWrap(brandName)} already exist.` });
		}

		const added = await db.brands.add(brandName).catch((error) => error);

		if (!added) {
			return fail(409, {
				success: false,
				message: `Something went wrong when adding ${spanWrap(brandName)}.`
			});
		}

		return {
			success: true,
			message: `Successfully add ${spanWrap(brandName)}`
		};
	},
	edit: async ({ request }) => {
		const formData = await request.formData();
		const brandName = formData.get('brandName');
		const newBrandName = formData.get('newBrandName');

		if (brandName === newBrandName) {
			return fail(409, { success: false, message: 'Same name' });
		}

		const updated = await db.brands.update(brandName, newBrandName).catch((error) => error);
		if (!updated) {
			console.log('Something went wrong when trying to update the brand name');
			console.log({ updated });
			return fail(500, { success: false, message: 'Something went wrong.' });
		}

		return {
			success: true,
			message: `Successfully changed from ${spanWrap(brandName)} to ${spanWrap(newBrandName)}`
		};
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const brandName = formData.get('brandName');

		const deleted = await db.brands.delete(brandName).catch((error) => error);

		if (!deleted) {
			console.log('Something went wrong when trying to delete the brand name');
			console.log({ deleted });
			return fail(500, { success: false, message: 'Something went wrong.' });
		}
		return { success: true, message: `Successfully deleted ${spanWrap(brandName)}` };
	}
} satisfies Actions;
