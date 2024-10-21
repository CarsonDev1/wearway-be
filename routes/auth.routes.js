import express from 'express';
import {
	register,
	login,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getMe,
} from '../controllers/auth.controller.js';
import authorize from '../middlewares/authorize.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - phone_number
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation errors or user already exists
 */

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);

router.use(authenticate);

router.get('/users', authorize('admin'), getAllUsers);
router.get('/users/:id', authorize(['admin', 'user']), getUserById);
router.put('/users/:id', authorize(['admin', 'user']), updateUser);
router.delete('/users/:id', authorize('admin'), deleteUser);
router.get('/me', getMe);
export default router;
