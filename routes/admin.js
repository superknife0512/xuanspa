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

const blogImgs = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './public/images/blogImgs');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const uploadService = multer({storage: serviceImgs}).array('images', 10);
const uploadBlog = multer({storage: blogImgs}).single('image');

const router = express.Router();

// get admin pannel
router.get('/', adminCtrl.getAdminPannel);

router.get('/service', adminCtrl.getService);
router.get('/service/:servId', adminCtrl.getEditService);
router.get('/create-service', adminCtrl.getCreateService);
router.post('/create-service', uploadService, adminCtrl.postCreateService);
router.post('/edit-service', uploadService, adminCtrl.postEditService);
router.post('/delete-service', adminCtrl.deleteService)

router.get('/blog', adminCtrl.getBlogs);
router.get('/create-blog', adminCtrl.getCreateBlog);
router.post('/create-blog',uploadBlog, adminCtrl.postCreateBlog);

module.exports = router;
