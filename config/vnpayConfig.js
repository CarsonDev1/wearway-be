import dotenv from 'dotenv';
dotenv.config();

const vnpayConfig = {
	vnp_TmnCode: 'A4C5ZBUB',
	vnp_HashSecret: 'RCOBMOJR6MQ24VZ2U03L18BW8CNC9N8Z',
	vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
	vnp_ReturnUrl: 'http://localhost:3000/cart?step=3',
	vnp_IpnUrl: 'https://yourdomain.com/vnpay_ipn',
};

console.log('VNP_TmnCode:', vnpayConfig.vnp_TmnCode);
console.log('VNP_HashSecret:', vnpayConfig.vnp_HashSecret);
console.log('VNP_ReturnUrl:', vnpayConfig.vnp_ReturnUrl);

export default vnpayConfig;
