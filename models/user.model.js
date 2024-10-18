import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: { type: String },
	email: { type: String, required: true, unique: true },
	phone_number: { type: String },
	password: { type: String, required: true },
	role: { type: String, default: 'user' },
	avatar: { type: String },
	address: { type: String },
	company: { type: String },
});

const User = mongoose.model('User', UserSchema);
export default User;
