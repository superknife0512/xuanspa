const express = require('express');
const adminCtrl = require('../controllers/adminCtrl');
const multer = require('multer');

const serviceImgs = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './public/images/serviceImgs');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const uploadService = multer({storage: serviceImgs}).array('images', 10)

const router = express.Router();

// get admin pannel
router.get('/', adminCtrl.getAdminPannel);

router.get('/service', adminCtrl.getService);
router.get('/service/:servId', adminCtrl.getEditService);
router.get('/create-service', adminCtrl.getCreateService);
router.post('/create-service', uploadService, adminCtrl.postCreateService);
router.post('/edit-service', uploadService, adminCtrl.postEditService);

module.exports = router;
