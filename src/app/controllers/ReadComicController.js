const DataProvider = require('../models/DataProvider');
const AuthFavor = require('../models/AuthFavor'); // Import module xử lý yêu thích

class ReadComicController {

    // [GET] /
    index(req, res) {
        res.render('read-comic', { title: '' });
    }

    // [POST] /api/read-comic
    async callAPI(req, res) {
        const { idUser, idTruyen } = req.body;
        console.log(idUser + idTruyen)

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
                await AuthFavor.addFavor(idUser, idTruyen);
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

}

module.exports = new ReadComicController;