import $ from 'jquery';

const aboutDOM = document.getElementById('about');

if(aboutDOM){
    const html = JSON.parse($('input[name=html]').val());
    $('#about').append(html);
}