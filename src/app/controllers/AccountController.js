const DataProvider = require('../models/DataProvider');

class AccountController {

    // [GET] /
    index(req, res) {
        res.render('account', { title: '' });
    }

    // [POST] /api/account
    async callAPI(req, res) {
        const { email } = req.body;
        console.log(email)
        try {
            const account = await DataProvider.getAccountByEmail(email);
            if (!account) {
                return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
            }

            const dataLevel = await DataProvider.getLevelByID(account.id_user);
            const dataComicFavor = await DataProvider.getAllFavorites(account.id_user);
            const totalChaps = await DataProvider.getTotalChap(account.id_user);

            console.log('Lấy thông tin thành công');
            return res.json({
                success: true,
                dataUser: account,
                dataLevel,
                dataComicFavor,
                totalChaps,
                message: 'Lấy thông tin thành công'
            });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin tài khoản:', error);
            return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
        }
    }


}

module.exports = new AccountController;
