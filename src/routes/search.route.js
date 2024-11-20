const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const searchController = require('../app/controllers/SearchController');

router.post('/api', searchController.callAPI);
router.get('/', searchController.index);

module.exports = router;