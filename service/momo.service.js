import https from 'https';
import crypto from 'crypto';
import momoConfig from '../config/momoConfig.js';

export const createMomoPayment = async (orderId, amount) => {
	try {
		const { partnerCode, accessKey, secretKey, returnUrl, notifyUrl, endpoint } = momoConfig;
		const orderInfo = `Payment for order ${orderId}`;
		const requestId = orderId;
		const requestType = 'payWithMethod';
		const extraData = ''; // Pass any additional data here
		const autoCapture = true;

		// Raw signature to generate HmacSHA256
		const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

		// Generate the signature using HmacSHA256
		const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

		// Prepare the request payload
		const requestBody = JSON.stringify({
			partnerCode,
			requestId,
			amount,
			orderId,
			orderInfo,
			redirectUrl: returnUrl,
			ipnUrl: notifyUrl,
			requestType,
			extraData,
			autoCapture,
			signature,
			lang: 'vi',
		});

		// Set up the request options
		const options = {
			hostname: 'test-payment.momo.vn',
			port: 443,
			path: '/v2/gateway/api/create',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(requestBody),
			},
		};

		// Return a promise to handle async operation
		return new Promise((resolve, reject) => {
			const req = https.request(options, (res) => {
				res.setEncoding('utf8');
				let data = '';

				res.on('data', (chunk) => {
					data += chunk;
				});

				res.on('end', () => {
					const response = JSON.parse(data);
					if (response.resultCode === 0) {
						resolve(response); // Return the response if successful
					} else {
						reject(new Error(`Momo Payment Error: ${response.message}`));
					}
				});
			});

			req.on('error', (e) => {
				reject(new Error(`Problem with request: ${e.message}`));
			});

			req.write(requestBody);
			req.end();
		});
	} catch (error) {
		throw new Error(`Momo Payment Service Error: ${error.message}`);
	}
};
