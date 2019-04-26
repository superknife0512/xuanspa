import $ from 'jquery';

const aboutDOM = document.getElementById('about');

if(aboutDOM){
    const html = JSON.parse($('input[name=html]').val());
    $('#about').append(html);
}

const contentDOM = document.getElementsByClassName('blogDetail__content');

console.log(contentDOM);
if(contentDOM[0]){
    const html = JSON.parse($('input[name=html]').val());
    $('#content').append(html);
}