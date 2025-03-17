const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const accountController = require('../app/controllers/AccountController');

router.post('/change', accountController.callAPIChange);
router.post('/api', accountController.callAPI);
router.get('/', accountController.index);

module.exports = router;