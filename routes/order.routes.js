import express from 'express';
import * as orderController from '../controllers/order.controller.js';
// import { handleVnpayReturn } from '../vnpay_return.js';

const router = express.Router();

router.get('/', orderController.getOrders); // Lấy tất cả đơn hàng
router.get('/:id', orderController.getOrderById); // Lấy chi tiết đơn hàng theo ID
router.post('/create', orderController.createOrder); // Tạo đơn hàng mới
router.patch('/:id/status', orderController.updateOrderStatus); // Cập nhật trạng thái đơn hàng
router.delete('/:id', orderController.deleteOrder); // Xóa đơn hàng
router.post('/payment', orderController.initiatePayment);
router.post('/payment/ipn', orderController.handleMomoIPN);
router.post('/payment/vnpay', orderController.initiateVnpayPayment);
// router.get('/vnpay_return', handleVnpayReturn);

export default router;
