class HomeController {

    // [GET] /
    index(req, res) {
        res.render('home', { title: '' });
    }

    // [POST] /api/home
    async callAPI(req, res) {
        
    };

}

module.exports = new HomeController;