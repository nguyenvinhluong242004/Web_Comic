const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const typeController = require('../app/controllers/TypeController');

router.post('/api', typeController.callAPI);
router.get('/', typeController.index);

module.exports = router;