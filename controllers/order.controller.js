import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const createOrder = async (req, res) => {
	try {
		const { productId, quantity, customerName, customerAddress, customerPhone } = req.body;
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}
		const totalPrice = product.price * quantity;

		const newOrder = new Order({
			product: productId,
			quantity,
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
		const orders = await Order.find().populate('product');
		res.status(200).json(orders);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate('product');
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
