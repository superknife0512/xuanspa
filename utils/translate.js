const tagVn = ['Chăm sóc và trị liệu da mặt', 'Liệu pháp massage toàn thân','Chăm sóc và trị liệu da toàn thân', 'Các gói dịch vụ Spa làm đẹp', 'Tẩy lông'];
const tagEn = ['Facial care and treatment', 'Massage therapy', 'Body treatment', 'Spa package', 'Waxing'];
const tagKo = ['페이셜 케어 및 치료', '마사지 요법', '바디 트리트먼트', '스파 패키지', '제모'];

function tagLang(number,lang){
    let tag;

    if(lang === 'vn'){
        tag = tagVn[number]
    } else if (lang === 'en'){
        tag = tagEn[number];
    } else if (lang === 'ko'){
        tag = tagKo[number]
    }

    return tag;
}

const getSEOname = (string)=>{
    return string.replace(/ |\/|\,|\%/g, '-');
}

exports.translateTagFace = (serviceArr, lang)=>{ // know tag
    
    tag = tagLang(0, lang);

    return serviceArr.map(serv=>{
        const seoName = getSEOname(serv.name);
        return {
            ...serv._doc,
            tag,
            seoName
        }
    })
}

exports.translateTagMass =  (serviceArr, lang)=>{ // know tag
    
    tag = tagLang(1, lang);

    return serviceArr.map(serv=>{
        const seoName = getSEOname(serv.name);
        return {
            ...serv._doc,
            tag,
            seoName
        }
    })
}

exports.translateTagBody =  (serviceArr, lang)=>{ // know tag
    
    tag = tagLang(2, lang);

    return serviceArr.map(serv=>{
        const seoName = getSEOname(serv.name);

        return {
            ...serv._doc,
            tag,
            seoName
        }
    })
}

exports.translateTagOther =  (serviceArr, lang)=>{ // know tag
    
    tag = tagLang(4, lang);

    return serviceArr.map(serv=>{
        const seoName = getSEOname(serv.name);

        return {
            ...serv._doc,
            tag,
            seoName
        }
    })
}

exports.translateTagPackage =  (serviceArr, lang)=>{ // know tag
    
    tag = tagLang(3, lang);

    return serviceArr.map(serv=>{
        const seoName = getSEOname(serv.name);

        return {
            ...serv._doc,
            tag,
            seoName
        }
    })
}