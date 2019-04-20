const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Promotion = require('../models/Promotion');
const Product = require('../models/Product');
const AdminData = require('../models/AdminData');
const deleteFile = require('../utils/deleteImg');
// ADMIN SECTION ****************************************************
exports.getAdminPannel = async (req,res,next)=>{
    try{
        let langFilter = req.query.langFilter || 'vn'
        const adminData = await AdminData.findOne({lang: langFilter})
        res.render('admin/index.ejs',{
            title: 'Admin board',
            activeTab: 'home',
            err: null,
            editMode: true,
            langFilter,
            adminData
        })

    } catch (err){
        next(err)
    }
}

exports.postAdminData = async (req,res,next)=>{
    try {
        let heroImg, galleries, heroImgUrl, gallerieUrls;
        const lang = req.body.lang;

        if(lang === 'vn'){
            heroImg = req.files['heroImg'][0];
            galleries = req.files['gallery'];
            heroImgUrl = heroImg.path.replace(/\\/g, '/');
            gallerieUrls = galleries.map(gal=>{
                return gal.path.replace(/\\/g, '/')
            })
        }

        const title = req.body.title;
        const subTitle = req.body.subtitle;

        const recruitContent = {
            delta : req.body.recruitDelta,
            html: req.body.recruitHtml,
        }
        const aboutContent = {
            delta : req.body.aboutDelta,
            html: req.body.aboutHtml,
        }

        
        let adminData;
        if(lang == 'vn'){
    
            adminData = new AdminData({
                title,
                subTitle,
                recruitContent,
                aboutContent,
                heroImgUrl,
                gallerieUrls,
                lang
            })

        } else {
            adminData = new AdminData({
                title,
                subTitle,
                recruitContent,
                aboutContent,
                lang
            })
        }

        await adminData.save();
        res.redirect('/admin/')
        
    } catch (error) {
        next(error)
    }
}

exports.postEditAdmin = async (req,res,next)=>{
    try {
        const title = req.body.title;
        const lang = req.body.lang;
        const subTitle = req.body.subtitle;
        let heroImg, galleries;

        console.log(lang);

        const recruitContent = {
            delta : req.body.recruitDelta,
            html: req.body.recruitHtml,
        }
        const aboutContent = {
            delta : req.body.aboutDelta,
            html: req.body.aboutHtml,
        }
        const adminData = await AdminData.findOne({lang: lang});
        adminData.title = title;
        adminData.subTitle = subTitle;
        adminData.recruitContent = recruitContent;
        adminData.aboutContent = aboutContent;

        if(lang==='vn'){
            if(req.files['heroImg'][0] || req.files['gallery']){

                if(req.files['heroImg'][0]){
                    heroImg = req.files['heroImg'][0];
                    heroImgUrl = heroImg.path.replace(/\\/g, '/');
                    deleteFile(adminData.heroImgUrl);
                    adminData.heroImgUrl = heroImgUrl;
                }
                if(req.files['gallery']){
    
                    galleries = req.files['gallery'];
                    gallerieUrls = galleries.map(gal=>{
                        return gal.path.replace(/\\/g, '/')
                    })
                    adminData.gallerieUrls.forEach(img=>{
                        deleteFile(img)
                    })
                    adminData.gallerieUrls = gallerieUrls
                }
            }
        }

        await adminData.save();
        res.redirect(`/admin?langFilter=${lang}`)
        
    } catch (err) {
        next(err)
    }
}


// SERVICE SECTION **************************************************
exports.getService = async (req,res,next)=>{
    try {
        const langFilter = req.query.lang || null;
        const tagFilter = req.query.tag || null;
        console.log(langFilter, tagFilter);
        let services;

        if(!langFilter && !tagFilter){
            services =await Service.find().sort('-createdAt')
        } else if (langFilter && tagFilter === 'none') {
            services= await Service.find({lang: langFilter}).sort('-createdAt')
        } else if(langFilter === 'none' && tagFilter){
            services= await Service.find({tag: tagFilter}).sort('-createdAt')
        } else {
            services = await Service.find({lang: langFilter, tag: tagFilter}).sort('-createdAt');
        }

        const tags = services.map(serv=>{
            let newTab;
            if(serv.tag === 'face'){
                newTab = 'Facial care and treatment'
            } else if (serv.tag === 'massage' ){
                newTab = 'Massage therapy'
            } else if (serv.tag === 'body'){
                newtab = 'Body treatment'
            } else if (serv.tag ==='package'){
                newTab = 'Spa package'
            } else {
                newTab = 'Other'
            }
            return newTab
        })

        res.render('admin/service',{
            services,
            title: 'admin service',
            activeTab: 'service',
            tags,
            filApply:{
                lgFilter: langFilter,
                tgFilter: tagFilter,
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.getCreateService = async (req,res,next)=>{
    try {
        res.render('admin/createService',{
            title: 'create service',
            activeTab: 'service',
            err: null,
            editMode: false,
        })
        
    } catch (err) {
        next(err);
    }   
}

exports.postCreateService = async (req,res,next)=>{
    try {

        const name = req.body.name;
        const tag = req.body.tag;
        const views = Math.ceil( Math.random()*100 + 200 );
        const price = req.body.price; 
        const time = req.body.time;
        const lang = req.body.lang;
        let desc = req.body.desc;

        if(!name || !desc || !price || !time){
            return res.render('admin/createService', {
                err: 'You must full fill all the fields',
                title: 'Service',
                activeTab: 'service',
                editMode: false,
            })
        }

        desc = desc.split(';;')

        if(!req.files[0]){
            return res.render('admin/createService', {
                err: 'You must pick some images',
                title: 'Service',
                activeTab: 'service',
                editMode: false
            })
        }
        
        const imgArr = req.files.map(file=>{
            return file.path.replace(/\\/g, '/');
        })

        const service = new Service({
            name,
            desc,
            tag,
            views,
            price,
            time,
            lang,
            imgUrls: imgArr
        })

        await service.save();
        res.redirect('/admin/service')
        
    } catch (err) {
        next(err)
    }
}

exports.getEditService = async (req,res,next)=>{
    try {
        const service = await Service.findById(req.params.servId);
        res.render('admin/createService',{
            title: 'Edit',
            activeTab: 'service',
            err: null,
            editMode: true,
            service
        })
    } catch (err) {
        next(err)
    }
}

exports.postEditService = async (req,res,next)=>{
    try {
        const servId = req.body.servId;
        const name = req.body.name;
        const desc = req.body.desc;
        const tag = req.body.tag;
        const price = req.body.price;
        const time = req.body.time;

        const service = await Service.findById(servId);
        service.name = name;
        service.desc = desc;
        service.tag = tag;
        service.price = price;
        service.time = time;
        
        const files = req.files;
        if(files[0]){
            service.imgUrls.forEach(imgUrl=>{
                deleteFile(imgUrl)
            })
            let imgUrls = files.map(file=>{
                return file.path.replace(/\\/g, '/');
            })
            service.imgUrls = imgUrls;
        }

        await service.save();
        res.redirect('/admin/service')
        
    } catch (err) {
        next(err)
    }
}

exports.deleteService = async (req,res,next)=>{
    try {
        const servId = req.body.servId;
        const service = await Service.findById(servId);
    
        service.imgUrls.forEach(img=>{
            deleteFile(img);
        })
    
        await Service.findByIdAndRemove(servId);
        res.redirect('/admin/service')        
    } catch (err) {
        next(err)
    }
}

// BLOG SECTION **************************************************

exports.getBlogs = async (req,res,next)=>{
    try {
        const langFilter = req.query.lang || null;
        let blogs;

        if(!langFilter){
            blogs = await Blog.find().sort('-createdAt')
        } else {
            blogs = await Blog.find({lang: langFilter}).sort('-createdAt');
        }

        res.render('admin/blog',{
            title: 'Blogs',
            activeTab: 'blog',
            blogs,
            filApply:{
                lgFilter: langFilter
            }
        })

    } catch (err) {
        next(err)
    }
}

exports.getCreateBlog = async (req,res,next)=>{
    try {
        res.render('admin/createBlog', {
            title: 'Create Blog',
            activeTab: 'blog',
            err: null,
            editMode: false,
        })

    } catch (err) {
        next(err)
    }
}

exports.postCreateBlog = async (req,res,next)=>{
    try {
        const title = req.body.title;
        const shortDesc = req.body.shortDesc;
        const lang = req.body.lang;
        const html = req.body.html;
        const delta = req.body.delta;
        const views = Math.ceil(Math.random()*100+200);

        if(!title || !shortDesc || !delta){
            return res.render('admin/createBlog', {
                title: 'Create Blog',
                activeTab: 'blog',
                err: 'You must fill all fields',
                editMode: false,
            })
        }

        if(!req.file){
            return res.render('admin/createBlog', {
                title: 'Create Blog',
                activeTab: 'blog',
                err: 'You must pick an image',
                editMode: false,
            })
        }

        const imgUrl = req.file.path.replace(/\\/g, '/');

        const blog =new Blog({
            title,
            shortDesc,
            lang,
            html,
            delta,
            views,
            imgUrl
        })

        await blog.save();
        res.redirect('/admin/blog')

    } catch (err) {
        next(err)
    }
}

exports.getEditBlog = async (req,res,next)=>{
    try {
        const blog = await Blog.findById(req.params.blogId);

        res.render('admin/createBlog',{
            title: 'Edit blog',
            activeTab: 'blog',
            err: null,
            editMode: true,
            blog
        })
    } catch (err) {
        next(err)
    }
}

exports.postEditBlog = async (req,res,next)=>{
    try {
        const blog = await Blog.findById(req.body.blogId);

        const title = req.body.title;
        const shortDesc = req.body.shortDesc;
        const html = req.body.html;
        const delta = req.body.delta;
        let imgUrl;

        blog.title = title;
        blog.shortDesc = shortDesc;
        blog.html = html;
        blog.delta = delta;

        if(req.file){
            deleteFile(blog.imgUrl);
            imgUrl = req.file.path.replace(/\\/g, '/');
            blog.imgUrl = imgUrl;
        }

        await blog.save();
        res.redirect('/admin/blog')

    } catch (err) {
        next(err)
    }
}

exports.deleteBlog= async (req,res,next)=>{
    try {
        const blog = await Blog.findById(req.body.blogId);

        deleteFile(blog.imgUrl);
        await Blog.findByIdAndRemove(req.body.blogId);

        res.redirect('/admin/blog');

    } catch (err) {
        next(err)
    }
}

// PROMOTION SECTION **************************************************

exports.getPromotion = async (req,res,next)=>{
    try {
        const langFilter = req.query.lang || null;
        let pros;

        if(!langFilter){
            pros = await Promotion.find().sort('-createdAt')
        } else {
            pros = await Promotion.find({lang: langFilter}).sort('-createdAt');
        }

        res.render('admin/promotion',{
            title: 'Promotions',
            activeTab: 'promotion',
            promotions: pros,
            filApply:{
                lgFilter: langFilter
            }
        })

    } catch (err) {
        next(err)
    }
}

exports.getCreatePromotion = async (req,res,next)=>{
    try {
        res.render('admin/createPromotion', {
            title: 'Create Promotion',
            activeTab: 'promotion',
            err: null,
            editMode: false,
        })

    } catch (err) {
        next(err)
    }
}

exports.postCreatePromotion = async (req,res,next)=>{
    try {
        const title = req.body.title;
        const desc = req.body.desc;
        const discount = req.body.discount;
        const lang = req.body.lang;
        const timeStart = req.body.timeStart;
        const timeEnd = req.body.timeEnd;

        if(!title || !desc || !discount || !timeStart || !timeEnd){
            return res.render('admin/cretaePromotion', {
                title: 'Create Promotion',
                activeTab: 'promotion',
                err: 'You must fill all fields',
                editMode: false,
            })
        }

        if(!req.file){
            return res.render('admin/cretaePromotion', {
                title: 'Create Promotion',
                activeTab: 'promotion',
                err: 'You must pick one image',
                editMode: false,
            })
        }

        const promo = new Promotion({
            title,
            desc,
            discount,
            timeStart,
            timeEnd,
            lang,
            imgUrl: req.file.path.replace(/\\/g, '/')
        })

        await promo.save();
        res.redirect('/admin/promotion')

    } catch (err) {
        next(err)
    }
}

exports.getEditPromotion = async (req,res,next)=>{
    try {
        const promotion = await Promotion.findById(req.params.proId)
        res.render('admin/createPromotion', {
            title: 'Edit Promotion',
            activeTab: 'promotion',
            err: null,
            editMode: true,
            promotion
        })

    } catch (err) {
        next(err)
    }
}

exports.postEditPromotion = async (req,res,next)=>{
    try {
        const title = req.body.title;
        const desc = req.body.desc;
        const discount = req.body.discount;
        const timeStart = req.body.timeStart;
        const timeEnd = req.body.timeEnd;

        const promotion = await Promotion.findById(req.body.proId)
        
        const file = req.file;
        if(file){
            promotion.imgUrl = file.path.replace(/\\/g, '/');
        }

        promotion.title = title;
        promotion.desc = desc;
        promotion.discount = discount;
        promotion.timeStart = timeStart;
        promotion.timeEnd = timeEnd;

        await promotion.save();

        res.redirect('/admin/promotion')

    } catch (err) {
        next(err)
    }
}

exports.deletePromotion = async (req,res,next)=>{
    try {
        
        const promotion = await Promotion.findById(req.body.proId);

        deleteFile(promotion.imgUrl);
        await Promotion.findByIdAndRemove(req.body.proId);

        res.redirect('/admin/promotion')

    } catch (err) {
        next(err)
    }
}

// PRODUCT SECTION **************************************************

exports.getProduct =async (req,res,next)=>{
    try {
        const langFilter = req.query.lang || null;
        let products;

        if(!langFilter){
            products = await Product.find().sort('-createdAt')
        } else {
            products = await Product.find({lang: langFilter}).sort('-createdAt');
        }

        res.render('admin/product',{
            title: 'Product',
            activeTab: 'product',
            products,
            filApply:{
                lgFilter: langFilter
            }
        })

    } catch (err) {
        next(err)
    }
}

exports.getCreateProduct = async (req,res,next)=>{
    try {
        res.render('admin/createProduct', {
            title: 'Create product',
            activeTab: 'product',
            err: null,
            editMode: false,
        })

    } catch (err) {
        next(err)
    }
}

exports.postCreateProduct = async (req,res,next)=>{
    try {
        const name = req.body.name;
        const brand = req.body.brand;
        const desc = req.body.desc;
        const lang = req.body.lang;

        if(!name || !brand || !desc || !lang){
            return res.render('admin/createProduct', {
                title: 'Create product',
                activeTab: 'product',
                err: 'You must fill all the fields ',
                editMode: false,
            })
        }

        if(!req.file){
            return res.render('admin/createProduct', {
                title: 'Create product',
                activeTab: 'product',
                err: 'You must pick one image',
                editMode: false,
            })
        }

        const product = new Product({
            name,
            brand,
            desc,
            lang,
            imgUrl: req.file.path.replace(/\\/g, '/')
        })

        await product.save();

        res.redirect('/admin/product')

    } catch (err) {
        next(err)
    }
}

exports.getEditProduct = async (req,res,next)=>{
    try {
        const product = await Product.findById(req.params.prodId)
        res.render('admin/createProduct', {
            title: 'Edit Product',
            activeTab: 'product',
            err: null,
            editMode: true,
            product
        })

    } catch (err) {
        next(err)
    }
}

exports.postEditProduct = async (req,res,next)=>{
    try {
        const product = await Product.findById(req.body.prodId)
        const name = req.body.name;
        const desc = req.body.desc;
        const brand = req.body.brand;

        
        const file = req.file;
        
        if(file){
            deleteFile(product.imgUrl);
            product.imgUrl = file.path.replace(/\\/g, '/');
        }

        product.name = name;
        product.desc = desc;
        product.brand = brand;

        await product.save();

        res.redirect('/admin/product');

    } catch (err) {
        next(err)
    }
}

exports.deleteProduct = async (req,res,next)=>{
    try {
        console.log(req.body.prodId);
        
        const product = await Product.findById(req.body.prodId);

        deleteFile(product.imgUrl);
        await Product.findByIdAndRemove(req.body.prodId);

        res.redirect('/admin/product')

    } catch (err) {
        next(err)
    }
}
