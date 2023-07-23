import { toastStore } from '@skeletonlabs/skeleton';
import type { ToastSettings } from '@skeletonlabs/skeleton';

function setUpSQLightErrorData(error) {
	// Here I can generate more personalized message base on
	// the error: code, error number or even using map or ENUM
	// as well I can log the error into a database
	console.log();
	console.log(`############# ERROR IS LOGGED >>>>>>>>>>>>>>`);
	console.log(`Date: ${new Date().toLocaleString()}`);
	console.log('-------------------------------------');
	console.log(error);
	console.log('///////////// ERROR END >>>>>>>>>>>>>>');
	console.log();
	return {
		error: {
			message: error.message,
			code: error.code,
			errorNum: error.errno
		}
	};
}

function logError(error) {
	// I could send it the error log  in db
	// + log ID
	console.log();
	console.log(`############# ERROR IS LOGGED >>>>>>>>>>>>>>`);
	console.log(`Date: ${new Date().toLocaleString()}`);
	console.log('-------------------------------------');
	console.log(error.message);
	console.error(error);
	console.log('///////////// ERROR END >>>>>>>>>>>>>>');
	console.log();
}

export { setUpSQLightErrorData, logError };

function elementWrap(htmlElement, textContent) {
	return `<${htmlElement} class="">${textContent}</${htmlElement}>`;
}

/**
 *
 * @param {string} textContent
 * @param {string} classes
 * @returns {string} Span element with the shape of string
 */
export function spanWrap(textContent, classes = 'font-semibold') {
	return `<span class="${classes}">${textContent}</span>`;
}

export const toast = {
	warning(message: string) {
		const t: ToastSettings = {
			message: message,
			background: 'variant-filled-warning'
		};
		toastStore.trigger(t);
	},
	success(message: string) {
		const t: ToastSettings = {
			message: message,
			background: 'variant-filled-success'
		};
		toastStore.trigger(t);
	}
};
