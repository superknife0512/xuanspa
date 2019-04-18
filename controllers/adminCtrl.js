const Service = require('../models/Service');
const Blog = require('../models/Blog');
const deleteFile = require('../utils/deleteImg')

exports.getAdminPannel = async (req,res,next)=>{
    try{
        res.render('admin/index.ejs',{
            title: 'Admin board',
            activeTab: 'home'
        })

    } catch (err){
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
            services =await Service.find()
        } else {
            services = await Service.find({lang: langFilter, tag: tagFilter});
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
            blogs = await Blog.find()
        } else {
            blogs = await Blog.find({lang: langFilter});
        }

        res.render('admin/blog',{
            title: 'Blogs',
            activeTab: 'blog',
            blogs,
            filApply:{
                langFilter
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