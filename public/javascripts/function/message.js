import $ from 'jquery';

$('.mess__short').click(function(){
    $(this).next('.mess__detail').slideToggle(500);
})