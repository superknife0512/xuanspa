const express = require('express');
const router = express.Router();
const clientCtrl = require('../controllers/clientCtrl')

/* GET home page. */
router.get('/', clientCtrl.getHomePage);

//promotion
router.get('/promotion', clientCtrl.getPromotion);

router.get('/lang/:lang', clientCtrl.getLang);

//about 
router.get('/about-us', clientCtrl.getAbout);

// service
router.get('/services', clientCtrl.getService);
router.get('/services/*.:servId', clientCtrl.getServiceDetail);
router.get('/thankyou', clientCtrl.getThankyou);
router.post('/message', clientCtrl.postMessage);

// product
router.get('/product', clientCtrl.getProduct);

// blogs
router.get('/blog', clientCtrl.getBlogs);
router.get('/blog/:blogId', clientCtrl.getBlogDetail);

// contact
router.get('/contact', clientCtrl.getContact);




module.exports = router;
