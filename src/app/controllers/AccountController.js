const DataProvider = require('../models/DataProvider');

class AccountController {

    // [GET] /
    index(req, res) {
        res.render('account', { title: '' });
    }

    // [POST] /api/account
    async callAPI(req, res) {
        
    };

}

module.exports = new AccountController;
