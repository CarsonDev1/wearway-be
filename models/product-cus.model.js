import mongoose from 'mongoose';

const ProductCusSchema = new mongoose.Schema({
	shirtType: { type: String, required: true, enum: ['Áo thun', 'Áo Polo'] },
	size: { type: Number, required: true, enum: [1, 2, 3, 4] },
	color: { type: String, required: true, enum: ['Trắng', 'Đen', 'Vàng', 'Đỏ', 'Xanh dương', 'Hồng', 'Xanh lá'] },
	stickers: [{ type: String }],
	customTexts: [
		{
			text: String,
			fontSize: Number,
			color: String,
			position: { x: Number, y: Number },
		},
	],
	uploadedImages: [{ type: String }],
	drawing: [{ type: String }],
	basePrice: { type: Number, required: true },
	totalPrice: { type: Number, required: true },
	stickersCount: { type: Number, default: 0 },
	customTextsCount: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

const ProductCus = mongoose.model('ProductCus', ProductCusSchema);
export default ProductCus;
