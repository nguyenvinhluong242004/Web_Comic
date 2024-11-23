const pool = require('../config/database'); // Kết nối đến cơ sở dữ liệu

class AuthRegister {
    /**
     * Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu hay chưa
     * @param {string} email - Email người dùng nhập
     * @returns {Promise<boolean>} - Trả về true nếu email đã tồn tại, ngược lại false
     */
    static async isEmailExists(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM Users 
                 WHERE email = $1`,
                [email]
            );
            return result.rows.length > 0;
        } catch (err) {
            console.error('Lỗi khi kiểm tra email!', err);
            throw new Error('Lỗi kiểm tra email trong cơ sở dữ liệu');
        }
    }

    /**
     * Thêm tài khoản mới vào cơ sở dữ liệu
     * @param {string} username - Tên của người dùng
     * @param {string} email - Email của người dùng
     * @param {string} hashedPassword - Mật khẩu đã mã hóa
     * @returns {Promise<void>}
     */
    static async addNewAccount(email, username, hashedPassword) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Bắt đầu transaction

            // Thêm dữ liệu vào bảng Users
            const result = await client.query(
                `INSERT INTO Users (email, username, password, googleid, type)
                 VALUES ($1, $2, $3, $4, $5) RETURNING id_user`,
                [email, username, hashedPassword, null, 'Email']
            );
            const userId = result.rows[0].id_user; // Lấy ID_User vừa thêm

            // Thêm dữ liệu vào bảng LevelUser
            await client.query(
                `INSERT INTO LevelUser (id_user, total_chaps, level, type)
                 VALUES ($1, $2, $3, $4)`,
                [userId, 0, 1, 'Tu tiên']
            );

            await client.query('COMMIT'); // Xác nhận transaction
            console.log('Thêm tài khoản và cấp độ ban đầu thành công!');
        } catch (err) {
            await client.query('ROLLBACK'); // Quay lại nếu có lỗi
            console.error('Lỗi khi thêm tài khoản và cấp độ!', err);
            throw new Error('Lỗi thêm dữ liệu vào cơ sở dữ liệu');
        } finally {
            client.release(); // Giải phóng kết nối
        }
    }
}

module.exports = AuthRegister;
