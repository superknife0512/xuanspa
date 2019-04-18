import $ from 'jquery'

let curId;

$('.del-btn').click(function(){
    $('.popup__wrapper').addClass('activePopup')
    curId = $(this).next('.servId').val();
    $('input[name=servId]').val(curId);
})

$('.canc-btn').click(function(e){ 
    $('.popup__wrapper').removeClass('activePopup')
    curId = null;
})


