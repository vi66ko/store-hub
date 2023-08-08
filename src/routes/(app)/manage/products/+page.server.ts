import db from '$lib/server/db/connectDb';
import { error, fail } from '@sveltejs/kit';
import { spanWrap, setTableId } from '$lib/gadgetBag';

import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	let products = await db.products.getAll();
	const categories = await db.categories.getAll();
	const brands = await db.brands.getAll();

	products = setTableId(products);

	return { products, categories, brands };
}) satisfies PageServerLoad;

export const actions = {
	search: async () => {
		console.log('Action activated');
	},
	add: async ({ request }) => {
		const formData = await request.formData();
		const name: string = formData.get('name');
		const description: string = formData.get('description');
		const barcode: string = formData.get('barcode');
		const price: string = formData.get('price');
		const category: string = formData.get('category');
		const brand: string = formData.get('brand');

		if (name.length === 0)
			return fail(400, { success: false, message: `The name field cannot be empty` });

		if (price.length === 0)
			return fail(400, { success: false, message: `The price field cannot be empty` });

		const doesExist = await db.products.find(name).catch((error) => error);
		if (doesExist) {
			return fail(409, { success: false, message: `${spanWrap(name)} already exist.` });
		}

		const added = await db.products
			.add(name, description, barcode, price, category, brand)
			.catch((error) => error);

		if (!added) {
			return fail(409, {
				success: false,
				message: `Something went wrong when adding ${spanWrap(name)}.`
			});
		}

		return {
			success: true,
			message: `Successfully add ${spanWrap(name)}`
		};
	},
	edit: async ({ request }) => {
		console.log(`[[[[[[[[[[[ Edit ]]]]]]]]]]]`);
		const formData = await request.formData();
		const id = formData.get('id');
		const name = formData.get('name');
		const description = formData.get('description');
		const barcode = formData.get('barcode');
		const price = formData.get('price');
		const category = formData.get('category');
		const brand = formData.get('brand');

		const doesExist = await db.products.find(name, id).catch((error) => error);

		if (doesExist) {
			return fail(409, { success: false, message: `${spanWrap(name)} already exist.` });
		}

		const updated = await db.products
			.update(id, name, description, barcode, price, category, brand)
			.catch((error) => error);

		if (!updated) {
			console.log(`Something went wrong when trying to update ${name}`);
			console.log({ updated });
			return fail(500, { success: false, message: 'Something went wrong.' });
		}

		return {
			success: true,
			message: `Successfully updated ${spanWrap(name)}`
		};
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');

		const deleted = await db.products.delete(name).catch((error) => error);

		if (!deleted) {
			console.log(`Something went wrong when trying to delete the product with name = ${name}`);
			console.log({ deleted });
			return fail(500, { success: false, message: 'Something went wrong.' });
		}

		return { success: true, message: `Successfully deleted ${spanWrap(name)}` };
	}
} satisfies Actions;
