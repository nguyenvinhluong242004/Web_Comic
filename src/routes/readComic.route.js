const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const readComicController = require('../app/controllers/ReadComicController');

router.post('/api/getTotal', readComicController.callAPITotal);
router.post('/api/comment', readComicController.callAPIComment);
router.post('/api', readComicController.callAPIFavor);
router.get('/', readComicController.index);

module.exports = router;