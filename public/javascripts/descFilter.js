const descDOMs = document.querySelectorAll('.desc');

export function shortenText(){
    if(descDOMs){
        descDOMs.forEach(descDOM=>{

            let text = descDOM.innerHTML;
            if(text.split(' ').length > 10){
                text = text.split(' ').slice(0,10).join(' ') + '...'
            }
            descDOM.innerHTML = text;
        })
    }
}
