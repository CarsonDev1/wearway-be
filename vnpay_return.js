// import crypto from 'crypto';
// import querystring from 'qs';
// import vnpayConfig from '../config/vnpayConfig.js';

// export const handleVnpayReturn = (req, res) => {
// 	const vnp_Params = req.query;
// 	const secureHash = vnp_Params['vnp_SecureHash'];

// 	delete vnp_Params['vnp_SecureHash'];
// 	delete vnp_Params['vnp_SecureHashType'];

// 	const sortedParams = sortObject(vnp_Params);

// 	const signData = querystring.stringify(sortedParams, { encode: false });
// 	const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
// 	const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

// 	if (secureHash === signed) {
// 		const rspCode = vnp_Params['vnp_ResponseCode'];
// 		if (rspCode === '00') {
// 			// Giao dịch thành công
// 			res.render('success', { code: '00', message: 'Transaction successful' });
// 		} else {
// 			// Giao dịch thất bại
// 			res.render('error', { code: rspCode, message: 'Transaction failed' });
// 		}
// 	} else {
// 		res.render('error', { code: '97', message: 'Checksum failed' });
// 	}
// };

// function sortObject(obj) {
// 	const sorted = {};
// 	const keys = Object.keys(obj).sort();
// 	keys.forEach((key) => {
// 		sorted[key] = obj[key];
// 	});
// 	return sorted;
// }
