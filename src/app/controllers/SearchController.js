class SearchController {

    // [GET] /
    index(req, res) {
        res.render('search', { title: '' });
    }

    // [POST] /api/search
    async callAPI(req, res) {
        
    };

}

module.exports = new SearchController;
