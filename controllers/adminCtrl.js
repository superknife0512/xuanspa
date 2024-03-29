const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Promotion = require('../models/Promotion');
const Product = require('../models/Product');
const AdminData = require('../models/AdminData');
const Message = require('../models/Message');
const Footer = require('../models/Footer')

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
            editMode: !!adminData,
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
        const lang = req.body.lang[0];

        if(lang === 'vn'){
            heroImg = req.files['heroImg'][0];
            galleries = req.files['gallery'];
            heroImgUrl = heroImg.url;
            gallerieUrls = galleries.map(gal => gal.url)
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
            if(req.files['heroImg'] || req.files['gallery']){

                if(req.files['heroImg']){
                    heroImg = req.files['heroImg'][0];
                    const heroImgUrl = heroImg.url;
                    const heroBlobName = heroImg.blob
            
                    adminData.heroImgUrl = heroImgUrl;
                    adminData.heroBlobName = heroBlobName;
                }
                if(req.files['gallery']){
    
                    galleries = req.files['gallery'];
                    const gallerieUrls = galleries.map(gal=>{
                        return gal.url
                    })
                    const galleryBlobNames = galleries.map(gal=>{
                        return gal.blob
                    })

                    adminData.gallerieUrls = gallerieUrls
                    adminData.galleryBlobNames = galleryBlobNames
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
                newTab = 'Body treatment'
            } else if (serv.tag ==='package'){
                newTab = 'Spa package'
            } else {
                newTab = 'Other'
            }
            console.log(newTab);
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
            return file.url
        })

        const blobNames = req.files.map(file=>{
            return file.blob
        })

        const service = new Service({
            name,
            desc,
            tag,
            views,
            price,
            time,
            lang,
            imgUrls: imgArr,
            blobNames
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
        let desc = req.body.desc;
        const tag = req.body.tag;
        const price = req.body.price;
        const time = req.body.time;
        const service = await Service.findById(servId);
        desc = desc.split(';;');
        console.log(desc);
        service.name = name;
        service.desc = desc;
        service.tag = tag;
        service.price = price;
        service.time = time;
        

        const files = req.files;
        if(files[0]){
            service.blobNames.forEach(blName=>{
                deleteFile('services', blName)
            })
            let imgUrls = files.map(file=>{
                return file.url
            })

            const blobNames = files.map(file=>{
                return file.blob
            })
            service.imgUrls = imgUrls;
            service.blobNames = blobNames;
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
    
        service.blobNames.forEach(blName=>{
            deleteFile('services', blName);
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

        const imgUrl = req.file.url;
        const blobName = req.file.blobName;

        const blog =new Blog({
            title,
            shortDesc,
            lang,
            html,
            delta,
            views,
            imgUrl,
            blobName
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
            deleteFile('blogs', blog.blobName);
            imgUrl = req.file.url;
            blog.imgUrl = imgUrl;
            blog.blobName = req.file.blob;
        }

        await blog.save();
        res.redirect('/admin/blog')

    } catch (err) {
        next(err)
    }
}

exports.deleteBlog= async (req,res,next)=>{
    try {
        // const blog = await Blog.findById(req.body.blogId);

        // deleteFile('blogs', blog.blobName);
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
            imgUrl: req.file.url,
            blobName: req.file.blob
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
            deleteFile('promotions', promotion.blobName)
            promotion.imgUrl = file.url;
            promotion.blobName = file.blob;
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
        
        // const promotion = await Promotion.findById(req.body.proId);

        // deleteFile('promotions', promotion.blobName);
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
            imgUrl: req.file.url,
            blobName: req.file.blobName
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
            deleteFile('product', product.blobName);
            product.imgUrl = file.url;
            product.blobName = file.blob;
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
        // const product = await Product.findById(req.body.prodId);

        // deleteFile('product', product);
        await Product.findByIdAndRemove(req.body.prodId);

        res.redirect('/admin/product')

    } catch (err) {
        next(err)
    }
}


// Message section

exports.getMessage = async (req,res,next)=>{
    try {
        const messages = await Message.find().sort('-createdAt').populate('service');
        const date = messages.map(mess=>{
            return mess.createdAt.toISOString().split('T')[0].split('-').reverse().join('-')
        })
        res.render('admin/message', {
            title: 'Client message',
            activeTab: 'message',
            err: null,
            messages,
            date
        })

        
    } catch (err) {
        next(err)
    }
}

exports.deleteMessage = async (req,res,next)=>{
    try {
        const messId = req.body.messId ; 
        await Message.findOneAndRemove(messId);

        res.redirect('/admin/message');
        
    } catch (err) {
        next(err)
    }
}

// FOOTER --------------------------
exports.getFooter = async (req,res,next)=>{
    const footer = (await Footer.find())[0];
    try {
        res.render('admin/footer', {
            title: 'Footer',
            activeTab: 'footer',
            editMode: true,
            err: null,
            footer
        })
        
    } catch (err) {
        next(err)
    }
}

exports.postFooter = async (req,res,next)=>{
    try {
        const fb = req.body.fb;
        const trip = req.body.trip;
        const talk = req.body.talk;
        const ig = req.body.ig;
        const email = req.body.email;

        const file = req.file;

        const footer = new Footer({
            fb,
            talk,
            ig,
            trip,
            email,
            imgUrl: file.url
        })
        await footer.save();
        res.redirect('/admin/footer')

    } catch (err) {
        next(err)
    }
}

exports.putFooter = async (req,res,next)=>{    
    const fb = req.body.fb;
    const trip = req.body.trip;
    const talk = req.body.talk;
    const ig = req.body.ig;
    const email = req.body.email;
    const file = req.file;

    const footers = await Footer.find();
    let footer = footers[0]

    if (footers.length === 0) {
        // create new 
        footer = new Footer({
            fb,
            trip,
            talk,
            ig,
            email,
            imgUrl: file ? file.url : ''
        })

    } else {
        if(file) {
            footer.imgUrl = file.url;
            // TODO: Update later
            // const blobName = /\/(banner-.*$)/.exec(footer.imgUrl)[1];
            // deleteFile('admin', blobName);
        }
        footer.fb = fb;
        footer.trip = trip;
        footer.talk = talk;
        footer.ig = ig;
        footer.email = email;
    }
    try {
        await footer.save();
        res.redirect('/admin/footer')
    } catch (err) {
        next(err)
    }
}