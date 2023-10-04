const express = require('express');
const adminCtrl = require('../controllers/adminCtrl');
const multer = require('multer');
const authProtect = require('../middleware/authProtect');

const MulterAzureStorage = require('multer-azure-storage');

require('dotenv').config()

console.log('process.env.AZURE_CONNECTION_STRING', process.env.AZURE_CONNECTION_STRING);
const serviceImgs = new MulterAzureStorage({
    azureStorageConnectionString: process.env.AZURE_CONNECTION_STRING,
    containerName: 'services',
    containerSecurity: 'blob'
})

const blogImgs = new MulterAzureStorage({
  azureStorageConnectionString: process.env.AZURE_CONNECTION_STRING,
  containerName: 'blogs',
  containerSecurity: 'blob'
})

const promotionImgs = new MulterAzureStorage({
  azureStorageConnectionString: process.env.AZURE_CONNECTION_STRING,
  containerName: 'promotions',
  containerSecurity: 'blob'
})

const productImg = new MulterAzureStorage({
  azureStorageConnectionString: process.env.AZURE_CONNECTION_STRING,
  containerName: 'product',
  containerSecurity: 'blob'
})

const adminImgs = new MulterAzureStorage({
  azureStorageConnectionString: process.env.AZURE_CONNECTION_STRING,
  containerName: 'admin',
  containerSecurity: 'blob'
})

const uploadService = multer({storage: serviceImgs}).array('images', 10);
const uploadBlog = multer({storage: blogImgs}).single('image');
const uploadPromotion = multer({storage: promotionImgs}).single('image')
const uploadProduct = multer({storage: productImg}).single('image')
const uploadAdminFooter = multer({storage: adminImgs}).single('banner')
const uploadAdmin = multer({storage: adminImgs}).fields([{name: 'heroImg', maxCount: 1}, {name: 'gallery', maxCount: 12}])

const router = express.Router();

// get admin pannel
router.get('/', authProtect, adminCtrl.getAdminPannel);
router.post('/', authProtect, uploadAdmin, adminCtrl.postAdminData);
router.post('/edit', uploadAdmin, adminCtrl.postEditAdmin); //done

router.get('/service',authProtect, adminCtrl.getService);
router.get('/service/:servId',authProtect, adminCtrl.getEditService);
router.get('/create-service',authProtect, adminCtrl.getCreateService);
router.post('/create-service', uploadService, adminCtrl.postCreateService); // done
router.post('/edit-service', uploadService, adminCtrl.postEditService); // done
router.post('/delete-service', adminCtrl.deleteService)

router.get('/blog',authProtect, adminCtrl.getBlogs);
router.get('/blog/:blogId',authProtect, adminCtrl.getEditBlog);
router.get('/create-blog',authProtect, adminCtrl.getCreateBlog);
router.post('/create-blog',uploadBlog, adminCtrl.postCreateBlog); //done
router.post('/edit-blog',uploadBlog, adminCtrl.postEditBlog); //done
router.post('/delete-blog', adminCtrl.deleteBlog); //done

router.get('/promotion',authProtect, adminCtrl.getPromotion);
router.get('/promotion/:proId',authProtect, adminCtrl.getEditPromotion);
router.get('/create-promotion',authProtect, adminCtrl.getCreatePromotion);
router.post('/create-promotion',uploadPromotion, adminCtrl.postCreatePromotion); //done
router.post('/edit-promotion',uploadPromotion, adminCtrl.postEditPromotion); //done
router.post('/delete-promotion', adminCtrl.deletePromotion); //done

router.get('/product',authProtect, adminCtrl.getProduct);
router.get('/product/:prodId',authProtect, adminCtrl.getEditProduct);
router.get('/create-product',authProtect, adminCtrl.getCreateProduct);
router.post('/create-product',uploadProduct, adminCtrl.postCreateProduct); // done
router.post('/edit-product',uploadProduct, adminCtrl.postEditProduct); // done
router.post('/delete-product', adminCtrl.deleteProduct); // done

router.get('/message',authProtect, adminCtrl.getMessage);
router.post('/delete-message',authProtect, adminCtrl.deleteMessage);

router.get('/footer', authProtect, adminCtrl.getFooter)
router.post('/post-footer', authProtect, uploadAdminFooter, adminCtrl.postFooter)
router.post('/put-footer', authProtect, uploadAdminFooter, adminCtrl.putFooter)



module.exports = router;
