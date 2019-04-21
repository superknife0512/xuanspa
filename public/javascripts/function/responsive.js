import $ from 'jquery';

const responsiveDOM = document.querySelector('.responsive');

if(responsiveDOM){
    $('.responsive').click(function(){
        $('.resmenu').addClass('resmenu__active')
    })

    $('.resmenu__close').click(function(){
        $('.resmenu').removeClass('resmenu__active')
    })
}