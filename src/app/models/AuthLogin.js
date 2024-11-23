const pool = require('../config/database'); // Kết nối đến cơ sở dữ liệu
const authPass = require('../config/authPass'); // Module xác thực mật khẩu (nếu có)

class AuthLogin {
    /**
     * Kiểm tra thông tin tài khoản dựa trên email
     * @param {string} email - Email đăng nhập
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async findAccountByEmail(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM Users 
                 WHERE email = $1`,
                [email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Xác thực mật khẩu
     * @param {string} inputPassword - Mật khẩu nhập vào
     * @param {string} storedPassword - Mật khẩu trong cơ sở dữ liệu
     * @returns {Promise<boolean>} - Trả về true nếu mật khẩu khớp, ngược lại false
     */
    static async verifyPassword(inputPassword, storedPassword) {
        try {
            return await authPass.verifyPassword(inputPassword, storedPassword);
        } catch (err) {
            console.error('Lỗi khi xác thực mật khẩu!', err);
            throw new Error('Lỗi xác thực mật khẩu');
        }
    }

}

module.exports = AuthLogin;
