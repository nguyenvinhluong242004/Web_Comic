class ReadComicController {

    // [GET] /
    index(req, res) {
        res.render('read-comic', { title: '' });
    }

    // [POST] /api/read-comic
    async callAPI(req, res) {
        
    };

}

module.exports = new ReadComicController;