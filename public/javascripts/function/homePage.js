import $ from 'jquery';

const allImgs = document.querySelectorAll('.hero__gallery--img');
const allDot = document.querySelectorAll('.hero__control--dot');
if(allDot[0] && allImgs[0]){

    function displayImg(index){
        allImgs.forEach(img=>{
            img.classList.add('deactive-img');
        })
        allImgs[index].classList.remove('deactive-img');
        allImgs[index].classList.add('active-img');
    }
    function displayDot(index){
        allDot.forEach(dot=>{
            dot.classList.remove('active-dot')
        })
        allDot[index].classList.add('active-dot');
    }

    let indexImg = 0;
    $('.hero__control--dot').click(function(){
        indexImg = $(this).data('dot');
        displayImg(indexImg);
        displayDot(indexImg);
    })
    displayImg(indexImg);
    displayDot(indexImg);
    indexImg++;
    setInterval(()=>{
        if(indexImg + 1 >= allImgs.length){
            indexImg = 0;
        } else {
            indexImg += 1;
        }
        displayImg(indexImg);
        displayDot(indexImg);
    }, 4000)

    $('.btn-hero').click(function(){
        $('html,body').animate({
            scrollTop: $("#book").offset().top
        }, 'slow');
    })

    const langActive = $('input[name=langActive]').val();
    if(langActive === 'vn'){
        $('img[alt=flag-vn]').addClass('active-flag');
    } else if (langActive === 'en'){
        $('img[alt=flag-en]').addClass('active-flag');
    } else if (langActive === 'ko'){
        $('img[alt=flag-ko]').addClass('active-flag');
    }

    setTimeout(() => {
        $('.promo-pop').addClass('activePopup')
    }, 3000);
    
}

    
$('.promo-pop__canc').click(function(){
    console.log('cax');
    $('.promo-pop').remove('activePopup')
    $('.promo-pop').addClass('deactivePopup')
})