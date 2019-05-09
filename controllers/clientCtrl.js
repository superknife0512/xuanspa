const mongoose = require('mongoose');

const AdminData = require('../models/AdminData');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Message = require('../models/Message');
const Blog = require('../models/Blog');
const Promotion = require('../models/Promotion');
const translate = require('../utils/translate');

//2 helper function
const getAdminDataVN = async ()=>{
    try{
        const admin = await AdminData.findOne({lang: 'vn'});
        return admin        
    } catch (err){
        throw err
    }
}

const titleTrans = (lang, vn, en, ko)=>{
    if(lang === 'vn'){
        return vn
    } else if (lang === 'en'){
        return en
    } else if (lang === 'ko'){
        return ko
    }
}

const getServices = async (lang)=>{
    try {
        const services = await Service.find({lang: lang});
        return services;
    } catch (err) {
        throw err
    }
}

const getAdminData = async (lang)=>{
    try {
        const admin = await AdminData.findOne({lang:lang});
        return admin        
    } catch (err) {
        throw err
    }
}


const langDir = (lang) => {
    let dir = 'viewVN';
    if(lang === 'en'){
        dir = 'viewEN';
    } else if (lang === 'ko'){
        dir = 'viewKO'
    }
    console.log('cax:', dir);
    return dir
}

// home page 
exports.getHomePage = async (req,res,next)=>{
    try {
        let adminDataVN = await getAdminDataVN();
        const lang = req.session.lang || 'vn';
        let langAdminData;
        if(lang !== 'vn'){
            langAdminData = await getAdminData(lang)
        }
        

        const dir = langDir(lang);
        
        let aditionalInfo = langAdminData || adminDataVN;

        const adminData = {
            ...aditionalInfo._doc,
            heroImgUrl: adminDataVN.heroImgUrl,
            gallerieUrls: adminDataVN.gallerieUrls
        }

        const bgUrl =`background-image: linear-gradient(90deg, rgba(44, 60, 42, .66) 0%,  rgba(25, 78, 60, 0.76) 100% ), url("${adminData.heroImgUrl}");` ;
        
        res.render(`${dir}/index`,{
            title: 'Home Page',
            adminData,
            lang,
            services: [],
            bgUrl
        })
    } catch (err) {
        next(err)
    }
}

//lang setup
exports.getLang = async(req,res,next)=>{
    try {
        const lang = req.params.lang;
        req.session.lang = lang;
        req.session.save(err=>{
            if(err){
                throw err
            } else {
                res.redirect('/')
            }
        })
    } catch (err) {
        next(err)
    }
}


//about page
exports.getAbout = async(req,res,next)=>{
    try {
        const lang = req.session.lang || 'vn';
        const adminDataVN = await getAdminDataVN();
        let langAdminData;
        if(lang !== 'vn'){
            langAdminData = await getAdminData(lang);
        }
        const dir = langDir(lang);

        const aditionalInfo = langAdminData || adminDataVN;

        const headerTitle = titleTrans(lang, 'Giới thiệu Spa', 'Spa introduction', '스파 소개');

        const adminData = {
            ...aditionalInfo._doc,
            heroImgUrl: adminDataVN.heroImgUrl,
            gallerieUrls: adminDataVN.gallerieUrls
        }



        res.render(`${dir}/about`,{
            title: 'About',
            adminData,
            activeTab: 'about',
            headerTitle,
        })
    } catch (err) {
        next(err)
    }
}


// service page
exports.getService = async (req,res,next)=>{
    try {
        const lang = req.session.lang || 'vn';
        const dir = langDir(lang);
        const services = await getServices(lang);
        
        function getServiceByTag(tag){
            const serviceTag = [];
            services.forEach(serv=>{
                if(serv.tag === tag){
                    serviceTag.push(serv)
                }
            })
            return serviceTag
        }

        const serviceFace = translate.translateTagFace(getServiceByTag('face'),lang);
        const serviceMassage = translate.translateTagMass(getServiceByTag('massage'),lang);
        const serviceBody = translate.translateTagBody(getServiceByTag('body'),lang);
        const servicePackage = translate.translateTagPackage(getServiceByTag('package'),lang);
        const serviceOther = translate.translateTagOther(getServiceByTag('other'),lang);

        console.log(serviceMassage);

        const headerTitle = titleTrans(lang, 'Dịch vụ', 'Services', '서비스')

        res.render(`${dir}/service`,{
            title:  headerTitle,
            activeTab: 'service',
            headerTitle,
            serviceFace,
            serviceBody,
            serviceMassage,
            servicePackage,
            serviceOther
        })
    } catch (err) {
        next(err)
    }
}

exports.getServiceDetail = async (req,res,next)=>{
    try {
        const lang = req.session.lang || 'vn';
        const servId = req.params.servId;
        const service = await Service.findById(servId);
        const dir = langDir(lang);

        service.views += 1;

        let services = await Service.find({lang, tag: service.tag});
        
        let newServices = services.filter(serv=>{
            return serv._id != servId
        })
        const seoNames  = newServices.map(serv=>{
            return serv.name.replace(/ |\/|\,|\%/g, '-');
        })

        res.render(`${dir}/serviceDetail`,{
            activeTab: 'service',
            headerTitle: service.name,
            title: service.name,
            service,
            services: newServices,
            seoNames,
        })

        await service.save()

    } catch (err) {
        next(err)
    }
}

exports.postMessage = async (req,res,next)=>{
    try {
        const name = req.body.name;
        const phone = req.body.phone;
        const servId = req.body.servId;
        const email = req.body.email;

        if(!name || !phone || !email){
            return res.redirect('/services')
        }
        let objectId = mongoose.Types.ObjectId(servId);
        let isBook = false;

        if(servId){
            isBook = true;
        }

        const message = req.body.mess;

        const booking = new Message({
            name,
            phone,
            service: objectId,
            email,
            message,
            isBook
        })
        
        await booking.save();

        res.redirect(`/thankyou`);
        
    } catch (err) {
        next(err)
    }
}

exports.getThankyou = async (req,res,next)=>{
    try {
        const lang = req.session.lang || 'vn';
        const dir = langDir(lang);
        const headerTitle = titleTrans(lang, 'Cảm ơn bạn', 'Thank you', '고맙습니다')
        res.render(`${dir}/thankyou`,{
            title: headerTitle,
            headerTitle,
            activeTab: 'service'
        })
    } catch (err) {
        next(err);
    }
}

//product page 
exports.getProduct = async (req,res,next)=>{
    try {
        const lang = req.session.lang || 'vn';
        const products = await Product.find({lang});
        const dir = langDir(lang);

        const headerTitle = titleTrans(lang, 'Sản phẩm', 'Products', '제작품')

        res.render(`${dir}/product`,{
            activeTab: 'product',
            headerTitle: headerTitle,
            title: headerTitle,
            products
        })
        
    } catch (err) {
        next(err)
    }
}

//blogs page
exports.getBlogs = async (req,res,next)=>{
    try {
        const page = req.query.page || 1;
        const PER_PAGE = 6;

        const lang = req.session.lang || 'vn';
        const blogs = await Blog.find({lang})
                            .skip((page-1)*PER_PAGE)
                            .limit(PER_PAGE)
                            .sort('-createdAt');

        
        const numPage = Math.ceil(blogs.length / 6);
        const dir = langDir(lang);

        const headerTitle = titleTrans(lang, 'Cẩm nang', 'Blog', '수첩')

        res.render(`${dir}/blogs`,{
            activeTab: 'blog',
            headerTitle: headerTitle,
            title: headerTitle,
            blogs,
            numPage,
            page,
        })
        
    } catch (err) {
        next(err)
    }
}

exports.getBlogDetail = async (req,res,next)=>{
    try {
        const blogId = req.params.blogId;
        const lang = req.session.lang || 'vn';
        const blogs = await Blog.find({lang}).sort('-createdAt').limit(7);
        
        const others = blogs.filter(blog=>{
            return blog._id != blogId
        })
        const blog = blogs.find(blog=>{
            return blog._id == blogId
        })

        const date = blog.createdAt.toISOString().split('T')[0].split('-').reverse().join('-')
        const dir = langDir(lang);

        const headerTitle = titleTrans(lang, 'Bài viết chi tiết', 'Into the detail', '상세 기사');
        
        res.render(`${dir}/blogDetail`,{
            activeTab: 'blog',
            headerTitle: headerTitle,
            title: headerTitle,
            blog,
            others,
            date
        })
        
    } catch (err) {
        next(err)
    }
}

//promotion page
exports.getPromotion = async (req,res,next)=>{
    try {
        const lang = req.session.lang || 'vn';
        const dir = langDir(lang);
        const promotions = await Promotion.find({lang}).sort('-createdAt').limit(10);

        const headerTitle = titleTrans(lang, 'Khuyến mãi', 'Promotion', '승진');
        res.render(`${dir}/promotion`,{
            activeTab: 'promotion',
            headerTitle: headerTitle,
            title: headerTitle,
            promotions,
        })
        
    } catch (err) {
        next(err)
    }
}

//get Contact
exports.getContact = async (req,res,next)=>{
    try {
        const lang = req.session.lang || 'vn';
        const dir = langDir(lang);

        const services = await getServices(lang);

        const headerTitle = titleTrans(lang, 'Đặt chỗ', `Let's book`, '문의하기');
        
        res.render(`${dir}/contact`,{
            activeTab: 'contact',
            headerTitle: headerTitle,
            title: headerTitle,
            services
        })
        
    } catch (err) {
        next(err)
    }
}

// recruitment
exports.getRecruit = async (req,res,next)=>{
    try{
        const lang = req.session.lang || 'vn';
        const adminData =await getAdminData(lang);
        const dir = langDir(lang);
        const headerTitle = titleTrans(lang, 'Tuyển dụng', 'Recruitment', '모집');
        res.render(`${dir}/recruit`,{
            title: headerTitle,
            headerTitle: headerTitle,
            activeTab: 'recruit',
            adminData,
        })
    } catch(err){
        next(err);
    }
}