import dotenv from 'dotenv';
dotenv.config();

const vnpayConfig = {
	vnp_TmnCode: process.env.VNP_TMNCODE,
	vnp_HashSecret: process.env.VNP_HASHSECRET,
	vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
	vnp_ReturnUrl: process.env.VNP_RETURNURL,
	vnp_IpnUrl: process.env.VNP_IPNURL,
};

export default vnpayConfig;
