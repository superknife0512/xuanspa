const AdminData = require('../models/AdminData');

//2 helper function
const getAdminDataVN = async ()=>{
    try{
        const admin = await AdminData.findOne({lang: 'vn'});
        return admin        
    } catch (err){
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

        console.log(adminData);
        
        res.render(`${dir}/index`,{
            title: 'Home Page',
            adminData,
            lang,
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