import type { PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import db from '$lib/server/db/connectDb';

import { setTableId } from '$lib/gadgetBag';

export const load = (async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/');

	// get the top most sells
	const topALlTimeSells = await db.sells.getTopOfAllTime();

	/**
	 * So max records per page
	 * 100
	 *
	 * for sure have to return 100 records
	 * how much to display per table depends on localStorage
	 *
	 * The other way is by saved user settings
	 *
	 *
	 * For the number of pagination. Should know the count for all records so I ca display it
	 */

	return { locals, tableData: [], topSells: setTableId(topALlTimeSells) };
}) satisfies PageServerLoad;
