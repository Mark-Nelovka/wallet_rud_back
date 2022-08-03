const express = require('express');
// const { ctrlWrapper } = require('../../helpers');
const getCategories = require('../../controllers/categories/getCategories');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, getCategories);

module.exports = router;
