const home = require('./home.route');
const search = require('./search.route');
const detailComic = require('./detailComic.route');
const readComic = require('./readComic.route');
const type = require('./type.route');

function route(app) {

    app.use('/read-comic', readComic);

    app.use('/detail-comic', detailComic);

    app.use('/search', search);
    
    app.use('/type', type);
    
    app.use('/', home);

}

module.exports = route;