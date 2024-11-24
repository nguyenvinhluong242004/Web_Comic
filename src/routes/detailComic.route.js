const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const detailComicController = require('../app/controllers/DetailComicController');

router.post('/api/comment', detailComicController.callAPIComment);
router.post('/api/favor', detailComicController.callAPIFavor);
router.get('/', detailComicController.index);

module.exports = router;