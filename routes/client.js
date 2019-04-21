const express = require('express');
const router = express.Router();
const clientCtrl = require('../controllers/clientCtrl')

/* GET home page. */
router.get('/', clientCtrl.getHomePage);

router.get('/lang/:lang', clientCtrl.getLang);

//about 
router.get('/about-us', clientCtrl.getAbout);

module.exports = router;
