const pool = require('../config/database'); // Kết nối đến cơ sở dữ liệu

class AuthFavor {
    /**
     * Kiểm tra xem id_user và id_truyen có tồn tại trong bảng ComicFavor chưa
     * @param {number} idUser - ID của người dùng
     * @param {number} idTruyen - ID của truyện
     * @returns {Promise<boolean>} - Trả về true nếu đã tồn tại, ngược lại false
     */
    static async isFavorExist(idUser, idTruyen) {
        try {
            const result = await pool.query(
                `SELECT * 
                FROM ComicFavor 
                WHERE ID_User = $1 AND ID_Truyen = $2`,
                [idUser, idTruyen]
            );
            return result.rows.length > 0; // Nếu có bản ghi, trả về true
        } catch (err) {
            console.error('Lỗi khi kiểm tra yêu thích!', err);
            throw new Error('Lỗi khi kiểm tra yêu thích');
        }
    }

    /**
     * Thêm truyện vào danh sách yêu thích
     * @param {number} idUser - ID người dùng
     * @param {number} idTruyen - ID truyện
     */
    static async addFavor(idUser, idTruyen, tenTruyen) {
        try {
            await pool.query(
                `INSERT INTO ComicFavor (ID_User, ID_Truyen, Ten_Truyen) VALUES ($1, $2, $3)`,
                [idUser, idTruyen, tenTruyen]
            );
            console.log('Đã thêm truyện vào danh sách yêu thích!');
        } catch (err) {
            console.error('Lỗi khi thêm yêu thích!', err);
            throw new Error('Lỗi khi thêm yêu thích');
        }
    }

    /**
     * Xóa truyện khỏi danh sách yêu thích
     * @param {number} idUser - ID người dùng
     * @param {number} idTruyen - ID truyện
     */
    static async removeFavor(idUser, idTruyen) {
        try {
            await pool.query(
                `DELETE FROM ComicFavor WHERE ID_User = $1 AND ID_Truyen = $2`,
                [idUser, idTruyen]
            );
            console.log('Đã xóa truyện khỏi danh sách yêu thích!');
        } catch (err) {
            console.error('Lỗi khi xóa yêu thích!', err);
            throw new Error('Lỗi khi xóa yêu thích');
        }
    }
}

module.exports = AuthFavor;
