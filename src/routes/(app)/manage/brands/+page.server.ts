import { fail } from '@sveltejs/kit';
import db from '$lib/server/db/connectdb';
import { spanWrap } from '$lib/gadgetBag';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const brands = await db.brands.getAll();

	return { brands };
}) satisfies PageServerLoad;

export const actions = {
	async add({ request }) {
		const formData = await request.formData();
		const brandName = formData.get('name');

		const added = await db.brands.add(brandName).catch((error) => error);

		if (!added.isSuccessful) {
			return fail(409, { success: false, message: `${spanWrap(brandName)} already exist.` });
		}

		return {
			success: true,
			message: `Successfully add ${spanWrap(brandName)}`
		};
	},
	async edit({ request }) {
		const formData = await request.formData();
		const brandName = formData.get('name');
		const newBrandName = formData.get('newName');

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
	async delete({ request }) {
		const formData = await request.formData();
		const name = formData.get('name');

		const deleting = await db.brands.delete(name);

		if (!deleting) {
			console.log('Something went wrong when trying to delete the brand name');
			console.log({ deleting });
			return fail(500, { success: false, message: 'Something went wrong.' });
		}
		return { success: true, message: `Successfully deleted ${spanWrap(name)}` };
	}
} satisfies Actions;
