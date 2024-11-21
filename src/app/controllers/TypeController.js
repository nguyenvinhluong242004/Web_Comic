class TypeController {

    // [GET] /
    index(req, res) {
        res.render('type', { title: '' });
    }

    // [POST] /api/type
    async callAPI(req, res) {
        
    };

}

module.exports = new TypeController;
