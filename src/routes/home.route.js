const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const homeController = require('../app/controllers/HomeController');

router.post('/api', homeController.callAPI);
router.get('/', homeController.index);

module.exports = router;