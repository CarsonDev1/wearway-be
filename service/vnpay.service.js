import crypto from 'crypto';
import querystring from 'querystring';
import vnpayConfig from '../config/vnpayConfig.js';

export const createVnpayPayment = async (orderId, amount, orderInfo, bankCode = '') => {
	try {
		const { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl } = vnpayConfig;

		const vnp_Version = '2.1.0';
		const ipAddr = '127.0.0.1';
		const vnp_Command = 'pay';
		const vnp_CurrCode = 'VND';
		const locale = 'vn';
		const orderType = 'other'; // Bạn có thể tùy chỉnh theo loại đơn hàng
		const createDate = new Date().toISOString().slice(0, 19).replace(/T|:|-/g, '');

		let vnp_Params = {
			vnp_Version,
			vnp_Command,
			vnp_TmnCode,
			vnp_Amount: amount * 100,
			vnp_CurrCode,
			vnp_TxnRef: orderId,
			vnp_OrderInfo: orderInfo,
			vnp_OrderType: orderType,
			vnp_ReturnUrl,
			vnp_IpAddr: ipAddr,
			vnp_CreateDate: createDate,
			vnp_Locale: locale,
		};

		if (bankCode) {
			vnp_Params['vnp_BankCode'] = bankCode;
		}

		vnp_Params = sortObject(vnp_Params);

		const signData = querystring.stringify(vnp_Params);
		const hmac = crypto.createHmac('sha512', vnp_HashSecret);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

		vnp_Params['vnp_SecureHash'] = signed;

		const vnpUrl = `${vnp_Url}?${querystring.stringify(vnp_Params)}`;

		return {
			payUrl: vnpUrl,
		};
	} catch (error) {
		throw new Error(`VNPAY Payment Service Error: ${error.message}`);
	}
};

function sortObject(obj) {
	const sorted = {};
	const keys = Object.keys(obj).sort();
	keys.forEach((key) => {
		sorted[key] = obj[key];
	});
	return sorted;
}
