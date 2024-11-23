const home = require('./home.route');
const search = require('./search.route');
const detailComic = require('./detailComic.route');
const readComic = require('./readComic.route');
const type = require('./type.route');
const login = require('./login.route');
const register = require('./register.route');
const account = require('./account.route');

function route(app) {

    app.use('/read-comic', readComic);

    app.use('/detail-comic', detailComic);

    app.use('/search', search);
    
    app.use('/type', type);
    
    app.use('/login', login);
    
    app.use('/register', register);

    app.use('/account', account);
    
    app.use('/', home);

}

module.exports = route;