import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import { createMomoPayment } from '../service/momo.service.js';
import { createVnpayPayment } from '../service/vnpay.service.js';

export const initiateVnpayPayment = async (req, res) => {
	try {
		const { orderId, amount, orderDescription, bankCode } = req.body;
		const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		const vnpayResponse = await createVnpayPayment(orderId, amount, ipAddr, orderDescription, bankCode);

		if (vnpayResponse.payUrl) {
			res.status(200).json({ payUrl: vnpayResponse.payUrl });
		} else {
			throw new Error('Failed to generate VNPAY payment URL');
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const initiatePayment = async (req, res) => {
	try {
		const { orderId, amount } = req.body;

		const momoResponse = await createMomoPayment(orderId, amount);

		if (momoResponse.payUrl) {
			res.status(200).json({ payUrl: momoResponse.payUrl });
		} else {
			throw new Error('Failed to generate MoMo payment URL');
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Optional: Add IPN handler for MoMo notifications
export const handleMomoIPN = async (req, res) => {
	try {
		const { orderId, resultCode } = req.body;

		if (resultCode === 0) {
			// Payment successful, update order status
			const order = await Order.findById(orderId);
			if (order) {
				order.status = 'paid';
				await order.save();
			}
		}

		res.status(200).json({ message: 'IPN received successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const createOrder = async (req, res) => {
	try {
		const { products, customerName, customerAddress, customerPhone } = req.body;

		let totalPrice = 0;
		const productDetails = await Promise.all(
			products.map(async (item) => {
				const product = await Product.findById(item.productId);
				if (!product) {
					throw new Error(`Product not found for ID: ${item.productId}`);
				}
				totalPrice += product.price * item.quantity;
				return {
					product: item.productId,
					productName: product.name, // Add the product name here
					quantity: item.quantity,
				};
			})
		);

		const newOrder = new Order({
			products: productDetails,
			totalPrice,
			customerName,
			customerAddress,
			customerPhone,
		});

		await newOrder.save();
		res.status(201).json(newOrder);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getOrders = async (req, res) => {
	try {
		const orders = await Order.find().populate('products.product');
		res.status(200).json(orders);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate('products.product');
		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}
		res.status(200).json(order);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateOrderStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const { id } = req.params;

		const order = await Order.findById(id);
		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}

		order.status = status;
		order.updatedAt = Date.now();

		await order.save();
		res.status(200).json(order);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const order = await Order.findByIdAndDelete(id);

		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}

		res.status(200).json({ message: 'Order deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
