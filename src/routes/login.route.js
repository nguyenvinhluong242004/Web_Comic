const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const loginController = require('../app/controllers/LoginController');

router.post('/api', loginController.callAPI);
router.get('/', loginController.index);

module.exports = router;