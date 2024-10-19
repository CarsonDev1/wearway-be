import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	sold: { type: Number, default: 0 },
	reviewsCount: { type: Number, default: 0 },
	rating: { type: Number, default: 0 },
	imageUrls: { type: [String], required: true },
	size: { type: [String], required: true },
	createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
