import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
	products: [
		{
			product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
			productName: { type: String, required: true },
			quantity: { type: Number, required: true },
		},
	],
	totalPrice: { type: Number, required: true },
	customerName: { type: String, required: true },
	customerAddress: { type: String, required: true },
	customerPhone: { type: String, required: true },
	status: {
		type: String,
		enum: ['pending', 'shipped', 'delivered', 'canceled'],
		default: 'pending',
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
