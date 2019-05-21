import Quill from 'quill';
import $ from 'jquery';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': ['#841429', '#ca2242', '#ec3154', '#199f61', '#22ca7d', '#2289ca', '#1d9ae9'] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['video', 'link'],  
  
    ['clean']                                         // remove formatting button
  ];

  const editor1 = document.getElementById('editor1');
  const editor2 = document.getElementById('editor2');

  let quill1, quill2;

  if(editor1 && editor2){
    quill1 = new Quill('#editor1',{
        modules: {
            toolbar: toolbarOptions
        },
            theme: 'snow'
    })

    const reDeltaDOM = $('input[name=recruitDelta]');

    if(reDeltaDOM.val() !== ''){
        quill1.setContents(JSON.parse(reDeltaDOM.val()));
    }

    quill1.on('editor-change', function(){
        const delta = JSON.stringify(quill1.getContents());
        const html = JSON.stringify(quill1.root.innerHTML);
        $('input[name=recruitDelta]').val(delta);
        $('input[name=recruitHtml]').val(html)
    })

    quill2 = new Quill('#editor2',{
        modules:{
            toolbar: toolbarOptions
        },
            theme: 'snow'
    })  

    const abDeltaDOM = $('input[name=aboutDelta]');

    if(abDeltaDOM.val() !== ''){
        quill2.setContents(JSON.parse(abDeltaDOM.val()));
    }

    quill2.on('editor-change', function(){
        const delta = JSON.stringify(quill2.getContents());
        const html = JSON.stringify(quill2.root.innerHTML);
        $('input[name=aboutDelta]').val(delta);
        $('input[name=aboutHtml]').val(html)
    })
  }
