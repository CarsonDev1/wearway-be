import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Register function
export const register = async (req, res) => {
	try {
		const { username, email, phone_number, password } = req.body;

		// Kiểm tra các trường bắt buộc
		if (!username || !email || !phone_number || !password) {
			return res.status(400).json({ error: 'All required fields must be filled' });
		}

		// Kiểm tra xem email đã tồn tại hay chưa
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		// Mã hóa mật khẩu
		const hashedPassword = await bcrypt.hash(password, 12);

		// Tạo người dùng mới
		const newUser = new User({
			username,
			email,
			phone_number,
			password: hashedPassword,
		});

		await newUser.save();

		// Trả về thông tin người dùng (không bao gồm token)
		res.status(201).json({
			message: 'User registered successfully',
			user: {
				_id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				phone_number: newUser.phone_number,
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { identifier, password } = req.body; // identifier can be username, email, or phone_number

		if (!identifier || !password) {
			return res.status(400).json({ error: 'Both identifier and password must be provided' });
		}

		// Find user by either username, email, or phone_number
		const user = await User.findOne({
			$or: [{ email: identifier }, { phone_number: identifier }, { username: identifier }],
		});

		if (!user) {
			return res.status(400).json({ error: 'Invalid username, email, phone number, or password' });
		}

		// Check if the password matches
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid username, email, phone number, or password' });
		}

		// Generate JWT token
		const accessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});

		// Return the token and expiration time
		res.status(200).json({
			accessToken,
			expiresIn: process.env.JWT_EXPIRES_IN,
			role: user.role,
			_id: user._id,
			username: user.username || '',
			email: user.email || '',
			phone_number: user.phone_number || '',
			avatar: user.avatar || '',
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// api get me when login successful check authentication
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Get all users
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Get user by ID
export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Update user
export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedData = req.body;

		// Nếu mật khẩu được cập nhật, mã hóa nó
		if (updatedData.password) {
			updatedData.password = await bcrypt.hash(updatedData.password, 12);
		}

		// Find user by ID and update with new data, including address and company
		const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

		if (!updatedUser) return res.status(404).json({ error: 'User not found' });

		// Ensure the updated user data is returned correctly
		res.status(200).json({
			_id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			phone_number: updatedUser.phone_number,
			avatar: updatedUser.avatar,
			role: updatedUser.role,
			address: updatedUser.address, // Include address field
			company: updatedUser.company, // Include company field
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Delete user
export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
