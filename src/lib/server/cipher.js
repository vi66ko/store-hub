import crypto from 'node:crypto';

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(
	'03d68409fe4c35e641fb745c0ae7c9c86e5e9c74d7a47077c7d9779c1a08c4f4',
	'hex'
);
const iv = crypto.randomBytes(16);

function cipherIt(email) {
	const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
	let encryptedData = cipher.update(email, 'utf8', 'hex');
	encryptedData += cipher.final('hex');

	return { encryptedData, iv };
}

// console.log('sdsssssssssssssssssss');
// console.log(iv.toString('hex'));

function decipherIt(sessionId, iv) {
	const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
	let decryptedData = decipher.update(sessionId, 'hex', 'utf8');
	decryptedData += decipher.final('utf8');
}
// 	console.log('ivvvvvvvvvvvvvvvvvvvvvvvvv');
// console.log(iv);

const hash = crypto.createHmac('sha256', secretKey).update('ffssss').digest('hex');
console.log(hash);
