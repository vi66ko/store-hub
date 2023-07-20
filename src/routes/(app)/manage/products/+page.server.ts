import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const sourceData = [
		{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
		{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
		{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
		{ position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
		{ position: 5, name: 'Boron', weight: 10.811, symbol: 'B' }
	];

	return { sourceData };
}) satisfies PageServerLoad;

export const actions = {
	search: async () => {
		console.log('Action activated');
	},
	add: async () => {},
	edith: async () => {
		console.log('editiiiiiiiiiing');
	},
	delete: async () => {
		console.log('333222xxxxxxxxxxxxxxxxxxxx');
	}
} satisfies Actions;
