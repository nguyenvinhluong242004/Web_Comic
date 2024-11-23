const pool = require('../config/database'); // Kết nối đến cơ sở dữ liệu
const authPass = require('../utils/authPass'); // Module xác thực mật khẩu (nếu có)

class DataProvider {
    /**
     * Kiểm tra thông tin tài khoản dựa trên email
     * @param {string} email - Email đăng nhập
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async getAccountByEmail(email) {
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
     * Lấy tên cấp độ của User
     * @param {int} id_user - ID người dùng
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async getLevelByID(id_user) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM LevelUser 
                 WHERE id_user = $1`,
                [id_user]
            );

            if (result.rows.length > 0) {
                const result2 = await pool.query(
                    `SELECT * 
                     FROM NameLevel 
                     WHERE type = $1 AND level = $2`,
                    [result.rows[0].type, result.rows[0].level]
                );
                return result2.rows.length > 0 ? result2.rows[0] : null;
            }

        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }
    /**
 * Lấy tất cả truyện yêu thích của người dùng
 * @param {int} id_user - ID người dùng
 * @returns {Promise<Array>} - Trả về danh sách truyện yêu thích hoặc mảng rỗng nếu không có truyện yêu thích
 */
    static async getAllFavorites(id_user) {
        try {
            // Truy vấn bảng ComicFavor để lấy tất cả truyện yêu thích của người dùng
            const result = await pool.query(
                `SELECT cf.ID_Truyen
                FROM ComicFavor cf
                WHERE cf.ID_User = $1`,
                [id_user]
            );

            // Trả về danh sách truyện yêu thích
            return result.rows.length > 0 ? result.rows : [];
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }
}

module.exports = DataProvider;
