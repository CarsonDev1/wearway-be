import { bucket } from '../firebase.js';
import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
	try {
		const { title, description, price, discountPrice, category, size, loadCapacity, engine } = req.body;
		const images = req.files.image;
		const video = req.files.video ? req.files.video[0] : null;

		const imageUrls = await Promise.all(images.map(uploadFileToFirebase));
		const videoUrl = video ? await uploadFileToFirebase(video) : null;

		const newProduct = new Product({
			title,
			description,
			price,
			discountPrice,
			imageUrls,
			videoUrl,
			category,
			size,
			loadCapacity,
			engine,
		});

		await newProduct.save();
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const uploadFileToFirebase = (file) => {
	return new Promise((resolve, reject) => {
		const blob = bucket.file(file.originalname);
		const blobStream = blob.createWriteStream({
			metadata: {
				contentType: file.mimetype,
			},
		});

		blobStream.on('error', (error) => {
			reject(error);
		});

		blobStream.on('finish', async () => {
			try {
				await blob.makePublic();
				const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
				resolve(publicUrl);
			} catch (error) {
				reject(error);
			}
		});

		blobStream.end(file.buffer);
	});
};

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find().populate('comments').populate('category');
		res.status(200).json(products);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate('comments').populate('category');
		if (!product) return res.status(404).json({ error: 'Product not found' });
		res.status(200).json(product);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const searchProducts = async (req, res) => {
	try {
		const { title, content, createdAt, discountPrice, size, loadCapacity, engine } = req.body;

		const searchCriteria = {};
		if (title) searchCriteria.title = { $regex: title, $options: 'i' };
		if (content) searchCriteria.content = { $regex: content, $options: 'i' };
		if (createdAt) searchCriteria.createdAt = { $gte: new Date(createdAt) };
		if (discountPrice) searchCriteria.discountPrice = discountPrice;
		if (size) searchCriteria.size = { $regex: size, $options: 'i' };
		if (loadCapacity) searchCriteria.loadCapacity = loadCapacity;
		if (engine) searchCriteria.engine = { $regex: engine, $options: 'i' };

		const products = await Product.find(searchCriteria).populate('comments');
		res.status(200).json(products);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndDelete(id);

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, price, discountPrice, category, size, loadCapacity, engine } = req.body;

		const images = req.files.image;
		const video = req.files.video ? req.files.video[0] : null;

		let imageUrls = [];
		if (images) {
			imageUrls = await Promise.all(images.map(uploadFileToFirebase));
		}
		let videoUrl = null;
		if (video) {
			videoUrl = await uploadFileToFirebase(video);
		}

		const formattedCategory = Array.isArray(category)
			? category
					.filter((id) => mongoose.Types.ObjectId.isValid(id)) // Validate ObjectId strings
					.map((id) => mongoose.Types.ObjectId(id))
			: [];

		const updatedProductData = {
			title,
			description,
			price,
			discountPrice,
			category: formattedCategory.length > 0 ? formattedCategory : undefined, // Do not include if empty
			size,
			loadCapacity,
			engine,
		};

		if (imageUrls.length > 0) {
			updatedProductData.imageUrls = imageUrls;
		}
		if (videoUrl) {
			updatedProductData.videoUrl = videoUrl;
		}

		const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

		if (!updatedProduct) {
			return res.status(404).json({ error: 'Product not found' });
		}

		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
