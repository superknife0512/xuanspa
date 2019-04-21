const AdminData = require('../models/AdminData');
const Service = require('../models/Service')

//2 helper function
const getAdminDataVN = async ()=>{
    try{
        const admin = await AdminData.findOne({lang: 'vn'});
        return admin        
    } catch (err){
        throw err
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

    return dir
}

exports.getHomePage = async (req,res,next)=>{
    try {
        let adminDataVN = await getAdminDataVN();
        const lang = req.session.lang || 'vn';
        let langAdminData;

        const services = await getServices(lang)
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
        
        res.render(`${dir}/index`,{
            title: 'Home Page',
            adminData,
            lang,
            services,
        })
    } catch (err) {
        next(err)
    }
}

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

        const adminData = {
            ...aditionalInfo._doc,
            heroImgUrl: adminDataVN.heroImgUrl,
            gallerieUrls: adminDataVN.gallerieUrls
        }

        res.render(`${dir}/about`,{
            title: 'About',
            adminData,
            activeTab: 'about',
        })
    } catch (err) {
        next(err)
    }
}