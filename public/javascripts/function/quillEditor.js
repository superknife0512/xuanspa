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
    // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': ['#841429', '#ca2242', '#ec3154', '#199f61', '#22ca7d', '#2289ca', '#1d9ae9'] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['video', 'link'],  
    ['clean']                                         // remove formatting button
  ];
let quill;
const editorDOM = document.getElementById('editor');

if(editorDOM){
    quill = new Quill('#editor',{
            modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow'
    })

    const delta = $('input[name=delta').val();

    if(delta){
        quill.setContents(JSON.parse(delta));
    }
    
    quill.on('editor-change',function(){
        const html = quill.root.innerHTML;
        const delta = quill.getContents();
        const htmlString = JSON.stringify(html);
        const deltaString = JSON.stringify(delta);
    
        $('input[name=html').val(htmlString);
        $('input[name=delta').val(deltaString);
    })
}

