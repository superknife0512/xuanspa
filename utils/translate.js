const tagVn = ['Chăm sóc da mặt', 'Liệu trình maxa','Chăm sóc cơ thể', 'Các gói toàn diện', 'Toàn bộ dịch vụ'];
const tagEn = ['Facial care and treatment', 'Massage therapy', 'Body treatment', 'Spa package', 'All services'];
const tagKo = ['페이셜 케어 및 치료', '마사지 요법', '바디 트리트먼트', '스파 패키지', '모든 서비스'];

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