import type { PageServerLoad, Actions } from './$types';

import { db } from '$lib/server/db/connectdb';
import authDb from '$lib/server/db/auth';
import { redirect, fail } from '@sveltejs/kit';
import { empty } from 'svelte/internal';

export const load = (async ({ coockie, url }) => {
	// throw redirect(303, `/home?redirectTo=${url.pathname}`);
	// throw redirect(303, `/login?redirectTo=${url.pathname}`);

	return {};
}) satisfies PageServerLoad;

export const actions = {
	signIn: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('username');
		console.log('testche');

		// getUsername(name);
	},
	signUp: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username') || '';
		const email = data.get('email') || '';
		const password = data.get('password');
		const passwordConfirmation = data.get('passwordConfirmation');

		// Generally validation it will be in frontend
		// Here is for men with poor manners.
		// Do i really need this imitation of SQL injection protection?
		const usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
		// if (username === '' || !usernameRegex.test(username)) {
		// 	return fail(400, { message: 'Nice try' });
		// }

		// const emailRegex = /^[^|".][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z]+)+$/;
		// if (email === '' || !emailRegex.test(email)) {
		// 	return fail(400, { message: ' .!. Nice try again' });
		// }

		// const passRegex = /[\\'";]/g;
		// if (password === '' || passRegex.test(password)) {
		// 	return fail(400, { message: 'Here you are again .!.' });
		// }

		// //  checking the email into the data base  if it is already exist

		// if (password !== passwordConfirmation) {
		// 	return fail(400, { message: 'Passwords must match' });
		// }

		let user = {
			email: 'john@gmail.com',
			password: '123',
			name: 'John',
			role: 'admin'
		};

		authDb.singUp(user);
		// wirte to db
		try {
			// const addingNewUser = await db.insert('Users', user);
		} catch (error) {
			return error;
		}

		console.log('Siiiiign IiiiiiN');
		console.log({ username });
		console.log({ password });
		console.log({ passwordConfirmation });
		return {};
	}
} satisfies Actions;

// function userInputValidation(arg) {
// 	arg;
// }
