const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const readComicController = require('../app/controllers/ReadComicController');

router.post('/api', readComicController.callAPI);
router.get('/', readComicController.index);

module.exports = router;