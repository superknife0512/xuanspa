

const prices = document.querySelectorAll('.Price')

console.log(prices);

if(document.querySelector('.Price')){

    prices.forEach(price=>{
        const priceArr = price.innerHTML.toString().split('').reverse();
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
        
        price.innerHTML = result;

    })

    
}