class DetailComicController {

    // [GET] /
    index(req, res) {
        res.render('detail-comic', { title: '' });

    }

    // [POST] /api/detai-comic
    async callAPI(req, res) {
        const { id } = req.body; // Lấy email và password từ request
        
        try {
            console.log(id)
            
            return res.json({ success: true, message: 'Đăng nhập thành công' });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi đăng nhập' });
        }
    };

}

module.exports = new DetailComicController;