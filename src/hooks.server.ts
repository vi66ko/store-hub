import type { Handle } from '@sveltejs/kit';

import db from '$lib/server/db/connectdb';

export const handle = (async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session-id');

	const hasRecord = await db.sessions.getBySessionId(sessionId);

	console.log('######## Has record');
	console.log(hasRecord);

	// Do i need to check if the session expire?

	event.locals.user = hasRecord.data || null;

	return resolve(event);
}) satisfies Handle;
