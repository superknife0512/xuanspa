import $ from 'jquery';

if(document.querySelector('#btn-book')){
    $('#btn-book').click(function(){
        $('.book-pop').addClass('activePopup')
    })

    $('.book-pop__close').click(function(){
        $('.book-pop').removeClass('activePopup')
    })
}

if(document.querySelector('.prod-pop')){
    let name, brand, desc;
    $('.product__card').click(function(){
        name = $(this).find('input[name=name]').val();
        desc = $(this).find('input[name=desc]').val();
        brand = $(this).find('input[name=brand]').val();
        $('.prod-pop__name').html(name);
        $('#brand').html(`Thương hiệu từ ${brand}`);
        $('.prod-pop__content').html(desc);
        $('.prod-pop').addClass('activePopup');
    })

    $('.book-pop__close').click(function(){
        $('.prod-pop').removeClass('activePopup')
    })
}