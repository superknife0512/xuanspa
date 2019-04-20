import $ from 'jquery'

let curId;

$('.del-btn').click(function(){
    $('.popup__wrapper').addClass('activePopup')
    curId = $(this).next().val();
    $('.curId').val(curId);
})

$('.canc-btn').click(function(e){ 
    $('.popup__wrapper').removeClass('activePopup')
    curId = null;
})


