const express = require('express');
const router = express.Router();
const { getHomepage, postCreateUser } = require('../controllers/homeController')

router.get('/',)
router.post('/create-user', postCreateUser)

module.exports = router