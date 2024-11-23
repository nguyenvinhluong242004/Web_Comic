const AuthRegister = require('../models/AuthRegister'); // Import module xử lý đăng ký
const authPass = require('../utils/authPass'); // Import module mã hóa mật khẩu

class RegisterController {

    // [GET] /
    index(req, res) {
        res.render('register', { title: '' });
    }

    // [POST] /api/register
    async callAPI(req, res) {
        const { signupEmail, username, signupPassword } = req.body;

        try {
            // Kiểm tra email đã tồn tại chưa
            const emailExists = await AuthRegister.isEmailExists(signupEmail);

            if (emailExists) {
                // Nếu email đã tồn tại, trả về lỗi
                return res.json({ success: false, message: 'Email này đã được đăng ký.' });
            }

            // Mã hóa mật khẩu
            const hashedSignupPassword = await authPass.hashPassword(signupPassword);

            // Thêm tài khoản mới
            await AuthRegister.addNewAccount(signupEmail, username, hashedSignupPassword);

            // Phản hồi đăng ký thành công
            res.json({ success: true, message: 'Đăng ký thành công' });
        } catch (err) {
            console.error('Lỗi khi đăng ký!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi đăng ký' });
        }
    };

}

module.exports = new RegisterController;
