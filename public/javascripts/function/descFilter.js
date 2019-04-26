const descDOMs = document.querySelectorAll('.desc');
import $ from 'jquery';

export function shortenText(){
    if(descDOMs){
        descDOMs.forEach(descDOM=>{

            let text = descDOM.innerText;
            if(text.split(' ').length > 15){
                text = text.split(' ').slice(0,15).join(' ') + '...'
            }
            descDOM.innerHTML = text;
        })
    }
}

export function dateFilter(){
    if(document.querySelector('.blog__date')){
        const allDates = document.querySelectorAll('.blog__date-info');
        allDates.forEach(date=>{
            const dateText = date.innerText;
            let newDate = new Date(dateText);
            newDate = newDate.toISOString().split('T')[0].split('-').reverse().join('-');
            date.innerHTML = newDate
        })
    }
}
