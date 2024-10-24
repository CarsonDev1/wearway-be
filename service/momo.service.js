import axios from 'axios';
import crypto from 'crypto';
import momoConfig from '../config/momoConfig.js';

export const createMomoPayment = async (orderId, amount) => {
	try {
		const { partnerCode, accessKey, secretKey, endpoint, returnUrl, notifyUrl } = momoConfig;
		const requestId = `${partnerCode}-${Date.now()}`;
		const orderInfo = `Payment for order ${orderId}`;
		const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;

		// Generate signature using HmacSHA256
		const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

		// Prepare request payload
		const payload = {
			partnerCode,
			accessKey,
			requestId,
			amount,
			orderId,
			orderInfo,
			redirectUrl: returnUrl,
			ipnUrl: notifyUrl,
			requestType: 'captureWallet',
			extraData: '',
			signature,
			lang: 'en',
		};

		// Make request to Momo
		const response = await axios.post(endpoint, payload);
		return response.data;
	} catch (error) {
		throw new Error(`Momo Payment Error: ${error.message}`);
	}
};
