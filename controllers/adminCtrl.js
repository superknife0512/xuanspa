const Service = require('../models/Service');
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

exports.getService = async (req,res,next)=>{
    try {
        const services = await Service.find();
        const tags = services.map(serv=>{
            let newTab;
            if(serv.tag === 'face'){
                newTab = 'Facial care and treatment'
            } else if (serv.tag === 'massage' ){
                newTab = 'Massage therapy'
            } else if (serv.tag === 'body'){
                newtab = 'Body treatment'
            } else if (serv.tag ===' package'){
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
        const servId = req.params.servId;
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