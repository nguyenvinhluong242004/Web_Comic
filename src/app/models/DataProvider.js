const pool = require('../config/database'); // Kết nối đến cơ sở dữ liệu

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
    static async getAccountByID(id_user) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM Users 
                 WHERE id_user = $1`,
                [id_user]
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
                `SELECT cf.ID_Truyen, cf.Ten_Truyen
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
    /**
     * Lấy tất cả comment
     * @param {int} id_user - ID người dùng
     * @param {string} id_truyen - ID truyện
     * @param {string} id_chapter - ID chapter
     * @returns {Promise<Array>} - Trả về 
     */
    static async commentComic(id_user, id_truyen, content) {
        try {
            const currentDate = new Date(); // Lấy thời gian hiện tại
            await pool.query(
                `INSERT INTO CommentComic (ID_User, ID_Truyen, ID_Chapter, Content, Total_Favor, ID_User_Respond, Date) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id_user, id_truyen, null, content, 0, null, currentDate]
            );
            console.log("Đã thêm comment comic");
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async getAllCommentComic(id_truyen) {
        try {
            const result = await pool.query(
                `SELECT 
                    cc.ID_User,
                    cc.ID_Truyen,
                    cc.Content,
                    cc.Date,
                    u.Username,
                    nl.Name AS LevelName,
                    nl.Level
                 FROM 
                    CommentComic cc
                 JOIN 
                    Users u ON cc.ID_User = u.ID_User
                 LEFT JOIN 
                    LevelUser lu ON cc.ID_User = lu.ID_User
                 LEFT JOIN 
                    NameLevel nl ON lu.Level = nl.Level AND lu.Type = nl.Type
                 WHERE 
                    cc.ID_Truyen = $1 
                    AND cc.ID_Chapter IS NULL`,
                [id_truyen]
            );

            return result.rows.length > 0 ? result.rows : [];
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async commentChapter(id_user, id_truyen, id_chapter, content) {
        try {
            const currentDate = new Date(); // Lấy thời gian hiện tại
            await pool.query(
                `INSERT INTO CommentComic (ID_User, ID_Truyen, ID_Chapter, Content, Total_Favor, ID_User_Respond, Date) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id_user, id_truyen, id_chapter, content, 0, null, currentDate]
            );
            console.log("Đã thêm comment cho comic chapter");
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async getAllCommentChapter(id_truyen, id_chapter) {
        try {
            const result = await pool.query(
                `SELECT 
                    cc.ID_User,
                    cc.ID_Truyen,
                    cc.Content,
                    cc.Date,
                    u.Username,
                    nl.Name AS LevelName,
                    nl.Level
                 FROM 
                    CommentComic cc
                 JOIN 
                    Users u ON cc.ID_User = u.ID_User
                 LEFT JOIN 
                    LevelUser lu ON cc.ID_User = lu.ID_User
                 LEFT JOIN 
                    NameLevel nl ON lu.Level = nl.Level AND lu.Type = nl.Type
                WHERE cc.ID_Truyen = $1 AND cc.ID_Chapter = $2`,
                [id_truyen, id_chapter]
            );

            return result.rows.length > 0 ? result.rows : [];
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async totalChapter(id_user) {
        try {
            // Tăng Total_Chaps lên 1 trong bảng LevelUser
            await pool.query(
                `UPDATE LevelUser 
                 SET Total_Chaps = Total_Chaps + 1 
                 WHERE ID_User = $1`,
                [id_user]
            );

            console.log("Đã cập nhật Total_Chaps trong LevelUser");
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async getTotalChap(id_user) {
        try {
            const result = await pool.query(
                `SELECT *
                 FROM LevelUser 
                 WHERE ID_User = $1`,
                [id_user]
            );

            return result.rows.length > 0 ? result.rows[0] : [];
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async changeCultivation(email, cultivation) {
        try {
            // Tìm ID_User dựa vào email
            const user = await pool.query(
                `SELECT ID_User FROM Users WHERE Email = $1`,
                [email]
            );

            if (user.rows.length === 0) {
                throw new Error("Không tìm thấy tài khoản với email này");
            }

            const id_user = user.rows[0].id_user;

            // Cập nhật loại tu luyện
            const result = await pool.query(
                `UPDATE LevelUser 
                 SET Type = $2
                 WHERE ID_User = $1 
                 RETURNING *`,
                [id_user, cultivation]
            );

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu!", err);
            throw new Error("Lỗi truy vấn cơ sở dữ liệu");
        }
    }


}

module.exports = DataProvider;
