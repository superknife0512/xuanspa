const descDOMs = document.querySelectorAll('.desc');

export function shortenText(){
    if(descDOMs){
        descDOMs.forEach(descDOM=>{

            let text = descDOM.innerHTML;
            if(text.split(' ').length > 15){
                text = text.split(' ').slice(0,15).join(' ') + '...'
            }
            descDOM.innerHTML = text;
        })
    }
}
