const DataProvider = require('../models/DataProvider');
const AuthLogin = require('../models/AuthLogin');

class LoginController {

    // [GET] /
    index(req, res) {
        res.render('login', { title: '' });
    }

    // [POST] /api/login
    async callAPI(req, res) {
        const { loginEmail, loginPassword } = req.body; // Lấy email và mật khẩu từ request

        try {
            // Kiểm tra tài khoản có tồn tại hay không
            const account = await AuthLogin.findAccountByEmail(loginEmail);

            if (account) {
                // Xác thực mật khẩu
                const isMatch = await AuthLogin.verifyPassword(loginPassword, account.password);

                if (isMatch) {
                    // Lấy dữ liệu người dùng
                    console.log(loginEmail)
                    const dataLevel = await DataProvider.getLevelByID(account.id_user);
                    const dataComicFavor = await DataProvider.getAllFavorites(account.id_user);
                    const totalChaps = await DataProvider.getTotalChap(account.id_user);

                    console.log(dataComicFavor)

                    // Lưu tạm dữ liệu người dùng
                    //dataTempServer.setDataUser(account);

                    console.log('Đăng nhập thành công');
                    return res.json({ success: true, dataUser: account, dataLevel: dataLevel, dataComicFavor: dataComicFavor, totalChaps: totalChaps, message: 'Đăng nhập thành công' });
                } else {
                    console.log('Email hoặc mật khẩu không đúng');
                    return res.json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
                }
            } else {
                console.log('Email không tồn tại');
                return res.json({ success: false, message: 'Email không tồn tại' });
            }
        } catch (err) {
            console.error('Lỗi trong quá trình đăng nhập!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi đăng nhập' });
        }
    };

}

module.exports = new LoginController;
