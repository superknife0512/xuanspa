
const allImgs = document.querySelectorAll('.servDetail__img');

if(allImgs[0]){
    let index = 0;

    function displayImg(index){
        allImgs.forEach(img=>{
            img.classList.remove('activeImg')
        })

        allImgs[index].classList.add('activeImg')
    }

    displayImg(index);
    index+=1

    if (allImgs.length === 1) {
        return;
    }

    setInterval(() => {
        displayImg(index);
        index > allImgs.length - 2 ? index=0 : index++;
    }, 3000);
}