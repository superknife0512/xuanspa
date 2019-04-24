
import $ from 'jquery';

const price = $('.Price').html();

if(document.querySelector('.Price')){

    const priceArr = price.toString().split('').reverse();
    
    const newPrice = [];
    let count = 0;
    
    for(let i = 0; i < priceArr.length; i++){
        if(count < 3){
            newPrice.push(priceArr[i]);
            count++;
        } else {
            newPrice.push('.');
            count = 0;
            i--
        }
    }
    
    const result = newPrice.reverse().join('');
    
    $('.Price').text(result);
}