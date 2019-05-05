const express = require('express');
const adminCtrl = require('../controllers/adminCtrl');
const multer = require('multer');
const authProtect = require('../middleware/authProtect');

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

const promotionImgs = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './public/images/promotionImgs');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const productImg = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './public/images/productImgs');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const adminImgs = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './public/images/adminImgs');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const uploadService = multer({storage: serviceImgs}).array('images', 10);
const uploadBlog = multer({storage: blogImgs}).single('image');
const uploadPromotion = multer({storage: promotionImgs}).single('image')
const uploadProduct = multer({storage: productImg}).single('image')
const uploadAdmin = multer({storage: adminImgs}).fields([{name: 'heroImg', maxCount: 1}, {name: 'gallery', maxCount: 12}])

const router = express.Router();

// get admin pannel
router.get('/', authProtect, adminCtrl.getAdminPannel);
router.post('/', authProtect, uploadAdmin, adminCtrl.postAdminData);
router.post('/edit', uploadAdmin, adminCtrl.postEditAdmin);

router.get('/service',authProtect, adminCtrl.getService);
router.get('/service/:servId',authProtect, adminCtrl.getEditService);
router.get('/create-service',authProtect, adminCtrl.getCreateService);
router.post('/create-service', uploadService, adminCtrl.postCreateService);
router.post('/edit-service', uploadService, adminCtrl.postEditService);
router.post('/delete-service', adminCtrl.deleteService)

router.get('/blog',authProtect, adminCtrl.getBlogs);
router.get('/blog/:blogId',authProtect, adminCtrl.getEditBlog);
router.get('/create-blog',authProtect, adminCtrl.getCreateBlog);
router.post('/create-blog',uploadBlog, adminCtrl.postCreateBlog);
router.post('/edit-blog',uploadBlog, adminCtrl.postEditBlog);
router.post('/delete-blog',uploadBlog, adminCtrl.deleteBlog);

router.get('/promotion',authProtect, adminCtrl.getPromotion);
router.get('/promotion/:proId',authProtect, adminCtrl.getEditPromotion);
router.get('/create-promotion',authProtect, adminCtrl.getCreatePromotion);
router.post('/create-promotion',uploadPromotion, adminCtrl.postCreatePromotion);
router.post('/edit-promotion',uploadPromotion, adminCtrl.postEditPromotion);
router.post('/delete-promotion', adminCtrl.deletePromotion);

router.get('/product',authProtect, adminCtrl.getProduct);
router.get('/product/:prodId',authProtect, adminCtrl.getEditProduct);
router.get('/create-product',authProtect, adminCtrl.getCreateProduct);
router.post('/create-product',uploadProduct, adminCtrl.postCreateProduct);
router.post('/edit-product',uploadProduct, adminCtrl.postEditProduct);
router.post('/delete-product', adminCtrl.deleteProduct);

router.get('/message',authProtect, adminCtrl.getMessage);
router.post('/delete-message',authProtect, adminCtrl.deleteMessage);



module.exports = router;
