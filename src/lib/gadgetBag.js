function setUpSQLightErrorData(error) {
	// Here I can generate more personalized message base on
	// the error: code, error number or even using map or ENUM
	// as well I can log the error into a database
	console.log('############# ERROR IS LOGGED >>>>>>>>>>>>>>');
	console.log(error);

	return {
		isSuccessful: false,
		error: {
			message: error.message,
			code: error.code,
			errorNum: error.errno
		}
	};
}

export { setUpSQLightErrorData };
