const DataProvider = require('../models/DataProvider');
const AuthFavor = require('../models/AuthFavor'); // Import module xử lý yêu thích

class ReadComicController {

    // [GET] /
    index(req, res) {
        res.render('read-comic', { title: '' });
    }

    // [POST] /api/read-comic/favor
    async callAPIFavor(req, res) {
        const { idUser, idTruyen, tenTruyen } = req.body;
        console.log(idUser + idTruyen + tenTruyen)

        try {
            // Kiểm tra xem truyện đã có trong danh sách yêu thích của người dùng chưa
            const isExist = await AuthFavor.isFavorExist(idUser, idTruyen);
            let status = false;
            if (isExist) {
                // Nếu đã có, xóa truyện khỏi danh sách yêu thích
                await AuthFavor.removeFavor(idUser, idTruyen);
                console.log('Truyện đã bị xóa khỏi danh sách yêu thích');
            } else {
                // Nếu chưa có, thêm truyện vào danh sách yêu thích
                await AuthFavor.addFavor(idUser, idTruyen, tenTruyen);
                console.log('Truyện đã được thêm vào danh sách yêu thích');
                status = true;
            }

            const dataComicFavor = await DataProvider.getAllFavorites(idUser);

            console.log(dataComicFavor)
            return res.json({ success: true, dataComicFavor: dataComicFavor, favor: status, message: 'Done yêu thích' });

        } catch (err) {
            console.error('Lỗi khi xử lý yêu thích!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi xử lý yêu thích' });
        }
    };

    // [POST] /api/read-comic/comment
    async callAPIComment(req, res) {
        const { require, idUser, idTruyen, idChapter,  comment } = req.body;
        console.log(require + idUser + idTruyen + idChapter + comment)

        try {
            if (require) {

                await DataProvider.commentChapter(idUser, idTruyen, idChapter, comment);
            }

            const listCommentComic = await DataProvider.getAllCommentChapter(idTruyen, idChapter);

            console.log(listCommentComic)
            return res.json({ success: true, listCommentComic: listCommentComic, message: 'Done comment' });

        } catch (err) {
            console.error('Lỗi khi xử lý yêu thích!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi xử lý yêu thích' });
        }
    };

    // [POST] /api/read-comic/getTotal
    async callAPITotal(req, res) {
        const { idUser } = req.body;
        console.log(idUser)

        try {
            if (require) {

                await DataProvider.totalChapter(idUser);
            }

            const totalChaps = await DataProvider.getTotalChap(idUser);

            console.log(totalChaps)
            return res.json({ success: true, totalChaps: totalChaps, message: 'Done total' });

        } catch (err) {
            console.error('Lỗi khi xử lý yêu thích!', err);
            res.status(500).json({ error: 'Có lỗi xảy ra khi xử lý yêu thích' });
        }
    };

}

module.exports = new ReadComicController;